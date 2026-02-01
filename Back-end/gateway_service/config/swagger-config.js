const swaggerJsdoc = require('swagger-jsdoc')

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
        }
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerSpec };