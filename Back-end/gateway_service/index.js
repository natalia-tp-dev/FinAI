require('dotenv').config()
const express = require('express')
const { apiReference } = require('@scalar/express-api-reference')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const swaggerJsdoc = require('swagger-jsdoc');
const axios = require('axios')
const app = express()
const userRoutes = require('./routes/user-routes')
const categoryRoutes = require('./routes/category-routes')
const transactionRoutes = require('./routes/transaction-routes')
const goalRoutes = require('./routes/goals-routes')
const reportRoutes = require('./routes/report-routes')
const paymentRoutes = require('./routes/payment-routes')

MAIN_ROUTE = process.env.MAIN_ROUTE || 'https://finai-web-adtd.onrender.com'

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
            description: 'Rutas principales del API Gateway',
        },
        servers: [{ url: 'https://gateway-l8qg.onrender.com' }],
    },
    apis: ['./routes/*.js'], 
};


const getSpecs = async () => {
    try {
        const [payRes, aiRes] = await Promise.all([
            axios.get('https://payment-s7po.onrender.com/v3/api-docs'),
            axios.get('https://ai-jm4p.onrender.com/openapi.json')
        ]);
        return { payments: payRes.data, ai: aiRes.data };
    } catch (e) {
        console.error("Error cargando specs para Scalar:", e.message);
        return null;
    }
};


const gatewaySpec = swaggerJsdoc(swaggerOptions);

app.get('/reference', async (req, res) => {
    try {
        const specs = await getSpecs(); // Esto trae Java y Python
        if (!specs) return res.status(503).send("Servicios despertando... Reintenta.");

        const config = {
            theme: 'purple',
            // El truco es 'specs' en plural dentro de la configuración
            specs: [
                { label: 'Gateway (Node)', content: gatewaySpec },
                { label: 'Payments (Java)', content: specs.payments },
                { label: 'AI (FastAPI)', content: specs.ai }
            ]
        };

        res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>FinAI API Ecosystem</title>
        <meta charset="utf-8" />
        <style>body { margin: 0; }</style>
      </head>
      <body>
        <script id="api-reference" data-configuration='${JSON.stringify(config).replace(/'/g, "&apos;")}'></script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
    `);
    } catch (e) {
        res.status(500).send("Error: " + e.message);
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
