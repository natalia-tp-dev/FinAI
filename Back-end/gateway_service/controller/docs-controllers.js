const { apiReference } = require('@scalar/express-api-reference')
const axios = require('axios')
const { swaggerSpec } = require('../config/swagger-config')

// Función para hacer deep copy y agregar prefijos a tags
const processPaths = (paths, prefix) => {
    const processed = {};
    
    Object.entries(paths || {}).forEach(([path, methods]) => {
        processed[path] = {};
        
        Object.entries(methods).forEach(([method, config]) => {
            processed[path][method] = {
                ...config,
                tags: config.tags 
                    ? config.tags.map(tag => `${prefix} - ${tag}`)
                    : [prefix]
            };
        });
    });
    
    return processed;
};

// Función para extraer tags únicos
const extractUniqueTags = (...pathObjects) => {
    const tags = new Set();
    
    pathObjects.forEach(paths => {
        Object.values(paths || {}).forEach(methods => {
            Object.values(methods).forEach(config => {
                if (config.tags) {
                    config.tags.forEach(tag => tags.add(tag));
                }
            });
        });
    });
    
    return Array.from(tags);
};

// Obtener el spec OpenAPI del gateway
const getOpenApiSpec = (req, res) => {
    res.json(swaggerSpec);
};

// Debug de specs
const debugSpecs = async (req, res) => {
    try {
        const [payRes, aiRes] = await Promise.allSettled([
            axios.get('https://payment-s7po.onrender.com/v3/api-docs', { timeout: 10000 }),
            axios.get('https://ai-jm4p.onrender.com/openapi.json', { timeout: 10000 })
        ]);

        res.json({
            gateway: {
                pathCount: Object.keys(swaggerSpec.paths || {}).length,
                paths: Object.keys(swaggerSpec.paths || {}),
                tags: swaggerSpec.tags
            },
            payment: {
                status: payRes.status,
                pathCount: payRes.status === 'fulfilled' ? Object.keys(payRes.value.data.paths || {}).length : 0,
                paths: payRes.status === 'fulfilled' ? Object.keys(payRes.value.data.paths || {}) : [],
                tags: payRes.status === 'fulfilled' ? payRes.value.data.tags : [],
                error: payRes.status === 'rejected' ? payRes.reason.message : null
            },
            ai: {
                status: aiRes.status,
                pathCount: aiRes.status === 'fulfilled' ? Object.keys(aiRes.value.data.paths || {}).length : 0,
                paths: aiRes.status === 'fulfilled' ? Object.keys(aiRes.value.data.paths || {}) : [],
                tags: aiRes.status === 'fulfilled' ? aiRes.value.data.tags : [],
                error: aiRes.status === 'rejected' ? aiRes.reason.message : null
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Renderizar documentación completa
const getApiReference = async (req, res, next) => {
    try {
        console.log(' Cargando specs externos...');
        
        const [payRes, aiRes] = await Promise.allSettled([
            axios.get('https://payment-s7po.onrender.com/v3/api-docs', { timeout: 10000 }),
            axios.get('https://ai-jm4p.onrender.com/openapi.json', { timeout: 10000 })
        ]);

        // Procesar Gateway
        const gatewayPaths = processPaths(swaggerSpec.paths, 'Gateway');
        
        // Procesar Payment
        let paymentPaths = {};
        let paymentComponents = {};
        if (payRes.status === 'fulfilled' && payRes.value.data) {
            console.log(' Payment API cargada:', Object.keys(payRes.value.data.paths || {}).length, 'paths');
            paymentPaths = processPaths(payRes.value.data.paths, 'Payment');
            paymentComponents = payRes.value.data.components || {};
        } else {
            console.log(' Payment API error:', payRes.status === 'rejected' ? payRes.reason.message : 'No data');
        }

        // Procesar AI
        let aiPaths = {};
        let aiComponents = {};
        if (aiRes.status === 'fulfilled' && aiRes.value.data) {
            console.log('AI API cargada:', Object.keys(aiRes.value.data.paths || {}).length, 'paths');
            aiPaths = processPaths(aiRes.value.data.paths, 'AI');
            aiComponents = aiRes.value.data.components || {};
        } else {
            console.log(' AI API error:', aiRes.status === 'rejected' ? aiRes.reason.message : 'No data');
        }

        // Extraer tags únicos
        const allTags = extractUniqueTags(gatewayPaths, paymentPaths, aiPaths);
        
        const gatewayTags = allTags.filter(t => t.startsWith('Gateway -'));
        const paymentTags = allTags.filter(t => t.startsWith('Payment -'));
        const aiTags = allTags.filter(t => t.startsWith('AI -'));

        // Crear tag groups
        const tagGroups = [];
        if (gatewayTags.length > 0) {
            tagGroups.push({
                name: 'Gateway',
                tags: gatewayTags
            });
        }
        if (paymentTags.length > 0) {
            tagGroups.push({
                name: 'Payment Service',
                tags: paymentTags
            });
        }
        if (aiTags.length > 0) {
            tagGroups.push({
                name: 'AI Service',
                tags: aiTags
            });
        }

        const combinedSpec = {
            openapi: '3.0.0',
            info: {
                title: 'FinAI Complete API Documentation',
                version: '1.0.0',
                description: 'Entire documentation for FinAI services'
            },
            servers: [
                { url: process.env.GATEWAY_URL, description: 'Gateway Service' },
                { url: 'https://payment-s7po.onrender.com', description: 'Payment Service (Java)' },
                { url: 'https://ai-jm4p.onrender.com', description: 'AI Service (FastAPI)' }
            ],
            tags: allTags.map(tag => ({ name: tag })),
            'x-tagGroups': tagGroups,
            paths: {
                ...gatewayPaths,
                ...paymentPaths,
                ...aiPaths
            },
            components: {
                securitySchemes: {
                    ...(swaggerSpec.components?.securitySchemes || {}),
                    ...(paymentComponents?.securitySchemes || {}),
                    ...(aiComponents?.securitySchemes || {})
                },
                schemas: {
                    ...(swaggerSpec.components?.schemas || {}),
                    ...(paymentComponents?.schemas || {}),
                    ...(aiComponents?.schemas || {})
                }
            }
        };

        console.log(' Resumen del spec combinado:');
        console.log('  Gateway paths:', Object.keys(gatewayPaths).length);
        console.log('  Payment paths:', Object.keys(paymentPaths).length);
        console.log('  AI paths:', Object.keys(aiPaths).length);
        console.log('  Total paths:', Object.keys(combinedSpec.paths).length);
        console.log('  Tag groups:', tagGroups.length);

        return apiReference({
            theme: 'purple',
            spec: {
                content: combinedSpec
            },
            metaData: {
                title: 'FinAI API Documentation',
                description: 'Complete API reference for all FinAI services',
            }
        })(req, res, next);

    } catch (e) {
        console.error('General error:', e.message);
        console.error(e.stack);
        
        return apiReference({
            theme: 'purple',
            spec: {
                content: swaggerSpec
            },
            metaData: {
                title: 'FinAI Gateway API (Fallback)',
            }
        })(req, res, next);
    }
};

module.exports = {
    getOpenApiSpec,
    debugSpecs,
    getApiReference
};