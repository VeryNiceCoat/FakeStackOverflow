const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const cors = require('cors')

const Account = require('../models/user')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const Comment = require('../models/comments')

const cookieParser = require('cookie-parser')
const session = require('express-session')

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

/**
 * Used for Login, if guest@guest.com and guest is passed it should be the
 * guest login, otherwise its normal, same for admin, nothing special here
 */
router.get('/login', async (req, res) => {
  try {
    // Get Query info, don't use body
    const { email, password } = req.query
    const account = await Account.findOne({ email: email })
    if (!account) {
      return res.status(400).send('N')
    }
    const isMatch = await bcrypt.compare(password, account.password)

    if (isMatch) {
      req.session.cookie.expires = null
      req.session.cookie.maxAge = null
      req.session.name = account.name
      req.session.email = account.email
      req.session.uid = account._id
      req.session.save()
      // console.log(req.session);
      res.status(200).send(account.name)
    } else {
      res.status(401).send('Y')
    }
  } catch (error) {
    res.status(402).send("'d'")
    console.error(error.message)
  }
})

/**
 * Registers a new user, sends success if it works
 * REQ BODY for POST
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const passWord = bcrypt.hashSync(password, 5)
    let account = new Account({ name: name, email: email, password: passWord })
    await account.save()
    req.session.email = account.email
    req.session.name = account.name
    res.status(200).send('Success')
  } catch (error) {
    if ((error.code = 11000)) {
      res.status(400).send('Email already exists')
    } else {
      res.status(401).send('Server Error')
    }
    console.error(error.message)
  }
})

router.delete('/delete', async (req, res) => {
  try {
    const email = req.session.email
    if (!email) {
      return res.status(400).send('No email found in session')
    }

    const account = Account.findOne({ email: email })
    if (!account) {
      res.status(400).send('No Account Found')
    }
  } catch (error) {
    res.status(400).send('Email Not Found')
  }
})

module.exports = router
