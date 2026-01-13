const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

const authenticate = (req, res, next) => {
    try {
        //Getting token from cookies
        const token = req.cookies.token
        if (!token) return res.status(401).json({
            error: 'You are not authenticated'
        })
        //Decoded token info and storaging it in user's req
        const decoded = jwt.verify(token, SECRET_KEY)
        req.user = decoded
        //Jumping into next process
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({
            error: 'Expired token'
        })
        res.status(403).json({
            error: 'Token invalido o expirado',
            status: 403
        })
    }
}

module.exports = { authenticate }