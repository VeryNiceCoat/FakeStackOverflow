const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const cors = require('cors')

const Account = require('../models/user')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

router.get('/login', async (req, res) => {
  try {
    const { email, password } = req.query
    const account = await Account.findOne({ email: email })
    if (!account) {
      return res.status(400).send('N')
    }
    const isMatch = await bcrypt.compare(password, account.password)

    if (isMatch) {
      req.session.name = account.name
      req.session.email = account.email
      res.status(200).send(account.name)
    } else {
      res.status(401).send('Y')
    }
  } catch (error) {
    res.status(402).send("'d'");
    console.error(error.message)
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.query
    const passWord = bcrypt.hashSync(password, 5)
    let account = new Account({ name: name, email: email, password: passWord })
    await account.save()
    res.status(200).send('Success')
    req.session.email = account.email;
    req.session.name = account.name;
  } catch (error) {
    if ((error.code = 11000)) {
      res.status(400).send('Email already exists')
    } else {
        res.status(400).send("Server Error")
    }
    console.error(error.message)
  }
})

module.exports = router
