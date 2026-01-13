const validateCreate = (req, res, next) => {
    const { name, icon, color, background_color, user_id } = req.body
    
    if ( !name || !icon || !color || !background_color || !user_id ) {
        return res.status(400).json({
            error: 'Missing information'
        })
    }
    next()
}

const validateGet = (req, res, next) => {
    const { userId } = req.query
    if (!userId || userId === undefined) {
        return res.status(400).json({
            error: 'Missing information'
        })
    }
    next()
}

module.exports = { validateCreate, validateGet }