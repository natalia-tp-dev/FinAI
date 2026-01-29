const axios = require('axios')

const payUserPlan = async (req, res) => {
    try {
        const { id } = req.user; // ID que viene del token
        const { subscriptionId, plan_type } = req.body;
        
        const payload = {
            userId: id,          // Java espera "userId"
            subscriptionId,      // Java espera "subscriptionId"
            plan_type            // Java espera "plan_type"
        };

        // 1. Asegúrate de que PAYMENT_URL no termine en '/'
        const url = `${process.env.PAYMENT_URL}/api/payments/pay`;
        
        console.log("Enviando pago a Java:", url, payload);

        const response = await axios.post(url, payload);

        // Si Java responde 200/201, devolvemos éxito
        return res.status(200).json({
            message: 'Your payment has been successfully processed',
            data: response.data
        });
        
    } catch (error) {
        // 2. LOG detallado para depurar en Render
        console.error('❌ Error en payUserPlan:');
        if (error.response) {
            // El microservicio respondió con un error (400, 404, 500)
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
            return res.status(error.response.status).json({
                error: 'Error desde el servicio de pagos',
                details: error.response.data
            });
        }
        
        // Error de conexión (Timeout, DNS, etc.)
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