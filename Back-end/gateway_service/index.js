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
                url: process.env.GATEWAY_URL ,
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
        }
    },
    apis: ['./routes/*.js'], // Lee los comentarios OpenAPI de tus rutas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Endpoint para obtener el spec de este gateway
app.get('/openapi.json', (req, res) => {
    res.json(swaggerSpec);
});

// Usa el middleware de Scalar directamente
app.use(
    '/reference',
    apiReference({
        theme: 'purple',
        spec: {
            content: swaggerSpec
        },
        metaData: {
            title: 'FinAI API Documentation',
            description: 'Complete API reference for FinAI services',
            ogDescription: 'Financial AI API Documentation',
        }
    })
);

// Endpoint alternativo para combinar múltiples specs (opcional)
app.get('/reference-all', async (req, res) => {
    try {
        console.log('📡 Cargando specs externos...');
        
        const [payRes, aiRes] = await Promise.allSettled([
            axios.get('https://payment-s7po.onrender.com/v3/api-docs', { timeout: 10000 }),
            axios.get('https://ai-jm4p.onrender.com/openapi.json', { timeout: 10000 })
        ]);

        const externalSpecs = [];
        
        if (payRes.status === 'fulfilled') {
            console.log('✅ Payments API cargada');
            externalSpecs.push({
                url: 'https://payment-s7po.onrender.com',
                spec: payRes.value.data
            });
        } else {
            console.log('⚠️ Payments API no disponible:', payRes.reason.message);
        }

        if (aiRes.status === 'fulfilled') {
            console.log('✅ AI API cargada');
            externalSpecs.push({
                url: 'https://ai-jm4p.onrender.com',
                spec: aiRes.value.data
            });
        } else {
            console.log('⚠️ AI API no disponible:', aiRes.reason.message);
        }

        // Combinar specs en un solo documento
        const combinedSpec = {
            openapi: '3.0.0',
            info: {
                title: 'FinAI Complete API',
                version: '1.0.0',
                description: 'Documentación completa de todos los servicios de FinAI'
            },
            servers: [
                { url: process.env.GATEWAY_URL || 'http://localhost:3000', description: 'Gateway' },
                { url: 'https://payment-s7po.onrender.com', description: 'Payments Service' },
                { url: 'https://ai-jm4p.onrender.com', description: 'AI Service' }
            ],
            paths: {
                ...swaggerSpec.paths,
                ...(payRes.status === 'fulfilled' ? payRes.value.data.paths : {}),
                ...(aiRes.status === 'fulfilled' ? aiRes.value.data.paths : {})
            },
            components: {
                ...swaggerSpec.components,
                ...(payRes.status === 'fulfilled' ? payRes.value.data.components : {}),
                ...(aiRes.status === 'fulfilled' ? aiRes.value.data.components : {})
            }
        };

        return apiReference({
            theme: 'purple',
            spec: {
                content: combinedSpec
            },
            metaData: {
                title: 'FinAI Complete API Documentation',
            }
        })(req, res);

    } catch (e) {
        console.error('❌ Error:', e.message);
        res.status(500).send('Error cargando documentación completa');
    }
});

const PORT = process.env.PORT || process.env.GATEWAY_PORT || 3000

const startServer = async () => {
    try {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Gateway ready on port ${PORT}`);
            console.log(`Configured for origin: ${MAIN_ROUTE}`);
        });
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
};

startServer();