const axios = require('axios')

const createUserPlan = async (req, res) => {
    try {
        const { id } = req.user
        console.log(id);
        if (!id) {
            return res.status(400).json({error: 'No user id detected'})
        }
        try {
            await axios.post(`${process.env.PAYMENT_URL}/create-free-plan`, {id: id})
        } catch (error) {
            console.error(error)
        }
        res.status(200).json({message: 'Your free account has been created'})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = {createUserPlan}