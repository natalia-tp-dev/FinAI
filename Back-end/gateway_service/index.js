require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const userRoutes = require('./routes/user-routes')
const categoryRoutes = require('./routes/category-routes')
const transactionRoutes = require('./routes/transaction-routes')

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

const PORT = process.env.GATEWAY_PORT

app.listen(PORT, () => {
    console.log('Server running at http://127.0.0.1:'+PORT);
})
