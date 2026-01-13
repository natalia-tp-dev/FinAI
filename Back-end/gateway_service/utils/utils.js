const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

//Signing token with user param info and returning it
const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        isLogged: user.isLogged
        },
        SECRET_KEY,
        { expiresIn: '8h'}
    )
}

module.exports = { generateToken }