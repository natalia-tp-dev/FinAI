require('dotenv').config()
const express = require('express')
const { apiReference } = require('@scalar/express-api-reference')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const axios = require('axios')
const swaggerJsdoc = require('swagger-jsdoc')
const app = express()
const userRoutes = require('./routes/user-routes')
const categoryRoutes = require('./routes/category-routes')
const transactionRoutes = require('./routes/transaction-routes')
const goalRoutes = require('./routes/goals-routes')
const reportRoutes = require('./routes/report-routes')
const paymentRoutes = require('./routes/payment-routes')

const MAIN_ROUTE = process.env.MAIN_ROUTE || 'https://finai-web-adtd.onrender.com'

app.use(cors({
    origin: MAIN_ROUTE,
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/ai', goalRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/payments', paymentRoutes)


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FinAI Gateway API',
            version: '1.0.0',
            description: 'API Gateway para FinAI - Gestión financiera con IA',
        },
        servers: [
            {
                url: process.env.GATEWAY_URL,
                description: 'Gateway Server'
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token'
                }
            }
        },
        tags: [
            { name: 'Authentication & User', description: 'User management and authentication', 'x-displayName': 'Gateway' },
            { name: 'Categories', description: 'Category management', 'x-displayName': 'Gateway' },
            { name: 'Transactions', description: 'Transaction operations', 'x-displayName': 'Gateway' },
            { name: 'Goals & AI', description: 'Saving goals and AI analysis', 'x-displayName': 'Gateway' },
            { name: 'AI Reports', description: 'AI-generated reports', 'x-displayName': 'Gateway' },
            { name: 'Payments & Subscriptions', description: 'Payment processing', 'x-displayName': 'Gateway' }
        ]
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.get('/openapi.json', (req, res) => {
    res.json(swaggerSpec);
});

app.use('/reference', async (req, res, next) => {
    try {
        const [payRes, aiRes] = await Promise.allSettled([
            axios.get('https://payment-s7po.onrender.com/v3/api-docs', { timeout: 10000 }),
            axios.get('https://ai-jm4p.onrender.com/openapi.json', { timeout: 10000 })
        ]);

        let paymentPaths = {};
        let paymentComponents = {};
        let aiPaths = {};
        let aiComponents = {};

        if (payRes.status === 'fulfilled' && payRes.value.data) {
            const paymentData = payRes.value.data;
            
            if (paymentData.paths) {
                Object.keys(paymentData.paths).forEach(path => {
                    const methods = paymentData.paths[path];
                    Object.keys(methods).forEach(method => {
                        if (methods[method].tags) {
                            methods[method].tags = methods[method].tags.map(tag => `Payment - ${tag}`);
                        }
                    });
                });
                paymentPaths = paymentData.paths;
            }
            
            if (paymentData.components) {
                paymentComponents = paymentData.components;
            }
        }

        if (aiRes.status === 'fulfilled' && aiRes.value.data) {
            const aiData = aiRes.value.data;
            
            if (aiData.paths) {
                Object.keys(aiData.paths).forEach(path => {
                    const methods = aiData.paths[path];
                    Object.keys(methods).forEach(method => {
                        if (methods[method].tags) {
                            methods[method].tags = methods[method].tags.map(tag => `AI - ${tag}`);
                        }
                    });
                });
                aiPaths = aiData.paths;
            }
            
            if (aiData.components) {
                aiComponents = aiData.components;
            }
        }

        const gatewayPaths = { ...swaggerSpec.paths };
        Object.keys(gatewayPaths).forEach(path => {
            const methods = gatewayPaths[path];
            Object.keys(methods).forEach(method => {
                if (methods[method].tags) {
                    methods[method].tags = methods[method].tags.map(tag => `Gateway - ${tag}`);
                }
            });
        });

        const combinedSpec = {
            openapi: '3.0.0',
            info: {
                title: 'FinAI Complete API Documentation',
                version: '1.0.0',
                description: 'Documentación completa de todos los servicios de FinAI organizados por microservicio'
            },
            servers: [
                { url: process.env.GATEWAY_URL, description: 'Gateway Service' },
                { url: 'https://payment-s7po.onrender.com', description: 'Payment Service (Java)' },
                { url: 'https://ai-jm4p.onrender.com', description: 'AI Service (FastAPI)' }
            ],
            tags: [
                { name: 'Gateway - Authentication & User', description: 'User management and authentication' },
                { name: 'Gateway - Categories', description: 'Category management' },
                { name: 'Gateway - Transactions', description: 'Transaction operations' },
                { name: 'Gateway - Goals & AI', description: 'Saving goals and AI analysis' },
                { name: 'Gateway - AI Reports', description: 'AI-generated reports' },
                { name: 'Gateway - Payments & Subscriptions', description: 'Payment processing' },
                { name: 'Payment - Transactions', description: 'Payment transactions' },
                { name: 'AI - Analysis', description: 'AI analysis endpoints' },
                { name: 'AI - Reports', description: 'Report generation' }
            ],
            'x-tagGroups': [
                {
                    name: 'Gateway',
                    tags: [
                        'Gateway - Authentication & User',
                        'Gateway - Categories',
                        'Gateway - Transactions',
                        'Gateway - Goals & AI',
                        'Gateway - AI Reports',
                        'Gateway - Payments & Subscriptions'
                    ]
                },
                {
                    name: 'Payment Service',
                    tags: [
                        'Payment - Subscriptions',
                        'Payment - Transactions'
                    ]
                },
                {
                    name: 'AI Service',
                    tags: [
                        'AI - Analysis',
                        'AI - Reports'
                    ]
                }
            ],
            paths: {
                ...gatewayPaths,
                ...paymentPaths,
                ...aiPaths
            },
            components: {
                securitySchemes: {
                    ...swaggerSpec.components?.securitySchemes,
                    ...paymentComponents?.securitySchemes,
                    ...aiComponents?.securitySchemes
                },
                schemas: {
                    ...swaggerSpec.components?.schemas,
                    ...paymentComponents?.schemas,
                    ...aiComponents?.schemas
                }
            }
        };

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
        console.error('Error:', e.message);
        
        return apiReference({
            theme: 'purple',
            spec: {
                content: swaggerSpec
            },
            metaData: {
                title: 'FinAI Gateway API Documentation',
            }
        })(req, res, next);
    }
});

const PORT = process.env.PORT || process.env.GATEWAY_PORT || 3000

const startServer = async () => {
    try {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Gateway ready on port ${PORT}`);
            console.log(`Configured for origin: ${MAIN_ROUTE}`);
            console.log(`📚 Complete API Docs: ${process.env.GATEWAY_URL}/reference`);
        });
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
};

startServer();