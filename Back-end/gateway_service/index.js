require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const userRoutes = require('./routes/user-routes')
const categoryRoutes = require('./routes/category-routes')
const transactionRoutes = require('./routes/transaction-routes')
const goalRoutes = require('./routes/goals-routes')
const reportRoutes = require('./routes/report-routes')
const paymentRoutes = require('./routes/payment-routes')

MAIN_ROUTE = process.env.MAIN_ROUTE

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

const PORT = process.env.PORT || process.env.GATEWAY_PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running at http://127.0.0.1:'+PORT);
})
