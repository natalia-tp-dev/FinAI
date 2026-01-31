require('dotenv').config()
const express = require('express')
const { apiReference } = require('@scalar/express-api-reference')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const axios = require('axios')
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

app.get('/reference', async (req, res) => {
    try {
        const specs = await getSpecs();
        if (!specs) return res.status(503).send("Servicios despertando en Render... Reintenta en 15 segundos.");

        // Escapar correctamente el JSON para evitar problemas de inyección
        const paymentsSpec = JSON.stringify(specs.payments).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
        const aiSpec = JSON.stringify(specs.ai).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

        console.log(aiSpec);
        res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>FinAI API Reference</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <script id="api-reference" data-configuration='{
          "theme": "purple",
          "spec": { "content": ${paymentsSpec} },
          "targets": [
            { "label": "Payments (Java)", "content": ${paymentsSpec} },
            { "label": "AI (FastAPI)", "content": ${aiSpec} }
          ]
        }'></script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
    `);
    } catch (e) {
        res.status(500).send("Error interno: " + e.message);
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