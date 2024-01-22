const userModel = require('../models/user');
const fs = require('fs');
const contentType = require('content-type');
const validateUserData = require('../utils/validate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createConnection = require('../utils/db');
const conn = createConnection();

const ROLES = {
    'User': 'user',
    'Admin': 'admin'
  }

const userSignUp = async (req, res) => {
    try {
        const parseContentType = contentType.parse(req.headers['content-type']);
        if (parseContentType.type !== 'application/json') {
            throw { status: 400, message: 'Bad request' };            
        } 
        const { name, email, password } = req.body;
        console.log(req);
        console.log(req.body);
        if (!name || !email || !password) {
            throw { status: 400, message: 'Please fill out required fields' };            
        } else if (!validateUserData(name, email, password)) {
            throw { status: 400, message: 'Invalid input' };
        }

        bcrypt.hash(password, 10, async (err, hashPasswd) => {
            if (err) {
                throw err;
            }

            (await conn).query('START TRANSACTION');
            const user = { name, email, password: hashPasswd, picture: '', provider: 'native', role: ROLES.User };
            const userInsertRes = await userModel.userSignUp(user);
    
            const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '1h' });
            
            res.status(200).json({
                data: {
                    access_token: token,
                    access_expired: 3600,
                    user: {
                        id: userInsertRes.id,
                        provider: 'native',
                        name,
                        email,
                        picture: '', 
                        role: user.role
                    },
                }   
            });
            (await conn).query('COMMIT');
        });
    } catch (error) {
        console.log(error);
        (await conn).query('ROLLBACK');
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'User already exists' });
        }
        return res.status(error.status || 500).json({ error: error.message });
    }
}

const userSignIn = async (req, res) => {
    try {
        const parseContentType = contentType.parse(req.headers['content-type']);
        if (parseContentType.type !== 'application/json') {
            throw { status: 400, message: 'Bad request' };            
        } 
        const { provider, email, password, name, picture } = req.body;

        (await conn).query('START TRANSACTION');
        if (provider === 'native') {
            const user = await userModel.userSignIn(email);
            if (!user) {
                throw { status: 403, message: 'Cannot find email or password' };
            }
            console.log(user.password + " " + password);
            const match = await bcrypt.compare(password, user.password);
            console.log(match);
            if (!match) {
                throw { status: 403, message: 'Wrong password' };
            } else {
                const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '1h' });
                console.log(token);
                res.status(200).json({
                    data: {
                        access_token: token,
                        access_expired: 3600,
                        user: {
                                id: user.id,
                                provider: provider,
                                name: user.name,
                                email,
                                picture: user.picture, 
                                role: user.role
                        },
                    }
                });
            }
        } else if (provider === 'google') {
            if (!email) {
                throw { status: 403, message: 'Cannot find google account' };
            } else {
                let user = await userModel.userSignIn(email);
                if (!user) {
                    user = await userModel.userSignUp({ name, email, password: '', picture, provider, role: ROLES.User });
                }
                const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '1h' });
                console.log(user);
                console.log(req.body);
                res.status(200).json({
                    data: {
                        access_token: token,
                        access_expired: 3600,
                        user: {
                                id: user.id || user.insertId,
                                provider: provider,
                                name: name,
                                email,
                                picture: picture, 
                                role: user.role
                        },
                    }
                });
            }
        }
        (await conn).query('COMMIT');

    } catch (error) {
        console.log(error); 
        (await conn).query('ROLLBACK');
        return res.status(error.status || 500).json({ error: error.message });
    }
    
} 

const userProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw { status: 401, message: 'Unauthorized or no token' };
        }
    
        jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
            if (err) {
                throw { status: 403, message: 'wrong token' };
            }
            const user = await userModel.userSignIn(decoded.email);
            if (!user) {
                throw { status: 403, message: 'no user, wrong token' };
            }
            return res.status(200).json({
                data: {
                    provider: user.provider,
                    name: user.name,
                    email: user.email,
                    picture: user.picture, 
                },
            });
        });   

    } catch (error) {
        console.log(error); 
        return res.status(error.status || 500).json({ error: error.message });
    }
}

module.exports = {
    userSignUp, 
    userSignIn, 
    userProfile
};