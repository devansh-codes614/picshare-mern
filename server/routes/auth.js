const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async function (req, res) {
    const bodyData = req.body;

    const alreadyUser = await User.findOne({ email: bodyData.email });
    if (alreadyUser) {
        return res.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(bodyData.password, 10);

    const newUser = new User({
        username: bodyData.username,
        email: bodyData.email,
        password: hashedPassword
    });

    await newUser.save();
    res.send({ message: 'User registered successfully' });

});
router.post('/login', async function (req, res) {
    const loginData = req.body;

    const founderuser = await User.findOne({ email: loginData.email });
    if (!founderuser) {
        return res.status(400).send({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(
        loginData.password,
        founderuser.password
    );
    if (!isMatch) {
        return res.status(400).send({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: founderuser._id }, 'picshare_secret');
    
    res.json({ message: 'Login successful', token: token });
});

module.exports = router;