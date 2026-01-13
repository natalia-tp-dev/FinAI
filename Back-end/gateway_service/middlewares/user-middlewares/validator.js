const validateRegister = (req, res, next) => {
    const { full_name, email, password } = req.body
    if (!full_name, !email, !password) return res.status(400).json({
        error: 'Please, complete all required fields.'
    }) 
    next()
}

const validateLogin = (req, res, next) => {
    const { email, password } = req.body
    if(!email || !password) return res.status(400).json({
        error: 'Please, complete all required fields.'
    })
    next()
}

module.exports = { validateRegister, validateLogin }