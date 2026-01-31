require('dotenv').config()
const bcrypt = require('bcryptjs')
const { v4: uuidv4, parse: parseUuid } = require('uuid')
const pool = require('../config/config')
const { generateToken } = require('../utils/utils')
const axios = require('axios')

const health = async (req, res) => {
    try {
        return res.status(200).json({ 
            status: 'OK', 
            service: 'Gateway'
        });
    } catch (error) {
        return res.status(500).json({ status: 'ERROR', details: error.message });
    }
}

const signUp = async (req, res) => {
    try {
        //Getting user info from req body
        const { full_name, email, password } = req.body;
        //Confirming user's email does not exist
        const [existing] = await pool.execute('SELECT email FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'There is an existing account with email: ' + email });
        }
        //Preparing user's data
        const userUuid = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //Creating user
        const sql = 'INSERT INTO users (id, full_name, email, password_hash) VALUES (UUID_TO_BIN(?),?,?,?)';
        await pool.execute(sql, [userUuid, full_name, email, hashedPassword]);
        try {
            await axios.post(`${process.env.PAYMENT_URL}/api/payments/initialize`, {
                id: userUuid
            })
        } catch (paymentError) {
            console.error('An error occured with payment service '+paymentError)
        }
        // Data used to generate token
        const newUser = {
            id: userUuid,
            full_name,
            email,
            isLogged: true
        };
        const token = generateToken(newUser);
        //Sending token via cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'none',
            maxAge: 3600000,
            path: '/'
        });
        return res.status(201).json({
            message: 'Your account has been successfully created'
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: 'Error creating account' });
    }
}

const signIn = async (req, res) => {
    //Getting user info from req body
    const { email, password } = req.body
    try {
        //Getting user info from db and confirming its existence
        const [rows] = await pool.execute('SELECT BIN_TO_UUID(id) as id, full_name, password_hash FROM users WHERE email = ?',[email])
        if (rows.length === 0) return res.status(404)
        //Preparing data and confirming password
        const userDB = rows[0];
        const valid = await bcrypt.compare(password, userDB.password_hash)
        if(!valid) return res.status(401).json({
            error: 'Password mistaken'
        })
        //Data sent to token and generating it
        const userForToken = {
            id: userDB.id,
            full_name: userDB.full_name,
            email: email,
            isLogged: true
        }
        const token = generateToken(userForToken)
        //Sending token via cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'none',
            maxAge: 96000000,
            path: '/'
        });
        return res.status(200).json({
            message: 'Login successful',
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Internal Service Error"
        })
    }
}

const profileInfo = async (req, res) => {
    try {
        // 1. Verificación de seguridad de req.user
        if (!req.user) {
            console.log("DEBUG: req.user es undefined");
            return res.status(401).json({ error: 'Usuario no autenticado en request' });
        }
        const { id, full_name, email, isLogged } = req.user;

        // 2. Verificación de seguridad de req.payment (EL POSIBLE FALLO)
        if (!req.payment) {
            console.log("DEBUG: req.payment es undefined. Revisar middleware getPaymentInfo.");
            // En lugar de romper, enviamos valores por defecto o error controlado
            return res.status(500).json({ error: 'No se pudo obtener la información de pago' });
        }

        const { plan_type, has_selected_plan, is_in_trial, subscription_status } = req.payment;

        res.status(200).json({ // Cambiado a 200 (OK) en lugar de 201 (Created)
            id,
            full_name,
            email,
            plan_type,
            has_selected_plan,
            is_in_trial,
            subscription_status,
            isLogged
        });
    } catch (error) {
        res.status(500).json({
            error: 'An error ocurred while trying to get the profile',
            details: error.message
        });
    }
}

const logOut = async (req, res) => {
    try {
        //Clear token from cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        })
        res.status(201).json({
            message: 'Succesfully logged out'
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'An error ocurred while logging out'
        })
    }
}

module.exports = { signUp, signIn, profileInfo, logOut, health }