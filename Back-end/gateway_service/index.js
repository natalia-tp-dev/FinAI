require('dotenv').config()
const express = require('express')
const { apiReference } = require('@scalar/express-api-reference')
const cookieParser = require('cookie-parser')
const cors = require('cors')
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

app.use(
    '/reference',
    apiReference({
        theme: 'purple',
        spec: {
            content: {
                openapi: '3.1.0',   
                info: {
                    title: 'FinAI API Gateway',
                    version: '1.0.0',
                },
                servers: [{ url: 'https://gateway-l8qg.onrender.com' }] 
            },
            configuration: {
                proxy: 'http://localhost:3000/api-proxy',
            },
            targets: [
                { label: 'Payments (Java)', url: 'https://payment-s7po.onrender.com/v3/api-docs' },
                { label: 'AI (FastAPI)', url: 'https://ai-jm4p.onrender.com/openapi.json' }
            ],
        },
    })
)
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
