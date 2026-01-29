const axios = require('axios')

const payUserPlan = async (req, res) => {
    try {
        const { id } = req.user; 
        const { subscriptionId, plan_type } = req.body;
        
        const payload = {
            userId: id,          
            subscriptionId,      
            plan_type            
        };

        const url = `${process.env.PAYMENT_URL}/api/payments/pay`;
        
        console.log("Enviando pago a Java:", url, payload);

        const response = await axios.post(url, payload);

        return res.status(200).json({
            message: 'Your payment has been successfully processed',
            data: response.data
        });
        
    } catch (error) {
        console.error('❌ Error en payUserPlan:');
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
            return res.status(error.response.status).json({
                error: 'Error desde el servicio de pagos',
                details: error.response.data
            });
        }
        return res.status(500).json({ error: 'Payment service unavailable' });
    }
}
const createUserPlan = async (req, res) => {
    try {
        const { id } = req.user
        console.log(id);
        if (!id) {
            return res.status(400).json({error: 'No user id detected'})
        }
        try {
            await axios.post(`${process.env.PAYMENT_URL}/api/payments/create-free-plan`, {id: id})
        } catch (error) {
            console.error(error)
        }
        res.status(200).json({message: 'Your free account has been created'})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports = {createUserPlan, payUserPlan}