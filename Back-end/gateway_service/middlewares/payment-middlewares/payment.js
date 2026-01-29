const axios = require('axios')


const getPaymentInfo = async (req, res, next) => {
    try {
        const { id } = req.user
        const response = await axios.get(`${process.env.PAYMENT_URL}/api/payments/status/${id}`)
        const payment = response.data
        req.payment =  payment
        next()
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = { getPaymentInfo }