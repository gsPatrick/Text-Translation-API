const express = require('express')
const {newUser, loginUser, profile} = require ('../services/userService');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'senhaLegal';
const router = express.Router();

const authenticateToken = (req,res,next) => {
    const authHeader = req.headers ['authorization'];
    const token = authHeader && authHeader.split (' ') [1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, jwt_secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.post('/register', async(req,res) => {

    try {

        const user = await newUser (req.body);
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


router.post('/login', async (req, res) =>{

    try{

        const {user, token} = await loginUser (req.body.email, req.body.password);
        res.status(200).json({ user,token});

    } catch (error) {
        res.status(401).json({ error: error.message });
    }

});


router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await profile(req.headers['authorization'].split(' ')[1]);
        res.status(200).json(user);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
});


module.exports = router;