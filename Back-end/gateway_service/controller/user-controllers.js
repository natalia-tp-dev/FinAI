require('dotenv').config()
const bcrypt = require('bcryptjs')
const { v4: uuidv4, parse: parseUuid } = require('uuid')
const pool = require('../config/config')
const { generateToken } = require('../utils/utils')
const axios = require('axios')

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
            await axios.post(`${process.env.PAYMENT_URL}/initialize`, {
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
        //Getting info from decoded token and sending it via response
        const { id, full_name, email, isLogged } = req.user      
        //Finding user's info from db with email and returning it in response
        const { plan_type, has_selected_plan, is_in_trial, subscription_status } = req.payment
        res.status(201).json({
            id,
            full_name,
            email,
            plan_type,
            has_selected_plan,
            is_in_trial,
            subscription_status,
            isLogged
        }) 
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error ocurred while trying to get the profile',
            status: 500
        })
    }
}

const logOut = async (req, res) => {
    try {
        //Clear token from cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
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

module.exports = { signUp, signIn, profileInfo, logOut }