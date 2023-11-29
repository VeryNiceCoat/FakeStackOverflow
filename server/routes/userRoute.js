const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const Account = require('../models/user')
const cookieParser = require('cookie-parser');

router.get('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Find the account by username
        const account = await Account.findOne({ name: name, email: email });
        if (!account) {
            return res.status(404).json({ check: false, cookie: undefined });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, account.password);

        if (isMatch) {
            res.cookie('email', email, {httpOnly: false}).send(true);
            // res.setHeader('Set-Cookie', `name=${name}`);
            // res.json({ check: true, cookie: email });
        } else {
            res.cookie('email', '0', {httpOnly: false}).send(false);
            res.send(false);
            // res.json({ check: false, cookie: undefined });
        }
    } catch (error) {
        console.error(error.message);
        res.cookie('email', '0', {httpOnly: false});
        // res.status(500).send(false);
        // res.status(500).json({ check: false, cookie: undefined });
    }
});

router.get('/:name/:email/:password', async (req, res) => {
    try {
        const name = req.params.name;
        const email = req.params.email;
        const password = req.params.password;
        const account = await Account.findOne({name: name, email: email});
        if (!account) {
            return res.status(404).send(false);
        }
        const isMatch = await bcrypt.compare(password, account.password);
        if (isMatch) {
            res.cookie('email', email, {httpOnly: false});
            res.send(true);
        } else {
            res.send('Password Incorrect');
        }
    } catch (error) {
        res.status(500).send(false);
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const passWord = bcrypt.hashSync(password, 5);
        // const userName = req.body.name;
        // const passWord = bcrypt.hashSync(req.body.password, 5);
        let account = new Account({name: name, email: email, password: passWord});
        await account.save();
        // res.cookie('name', name, {httpOnly: false});
        res.cookie('email', email, {httpOnly: false});
        res.status(201).send({success: true, cookie: email});
        //201 means resourec created.
        // res.status(201).json(tag);
    } catch (error){
        console.error(error.message);
        if (error.code === 11000) {
            res.cookie('email', '0', {httpOnly: false});
            res.status(400).send({success: false, cookie: "EMAIL"}); // 400 Bad Request
        } else {
            res.cookie('email', '0', {httpOnly: false});
            res.status(500).send({success: false, cookie: "SERVER"}); // 500 Internal Server Error
        }
    }
});

module.exports = router;