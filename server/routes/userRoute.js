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

router.get('/getAllUsers', async (req, res) => {
  try {
    const regularUsers = await Account.find({
      reputation: { $nin: [-1, -2] } // exclude admin and guest accounts
    });

    res.status(200).send(regularUsers);
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Error fetching all user accounts');
  }
});

/**
 * Used for Login, if guest@guest.com and guest is passed it should be the
 * guest login, otherwise its normal, same for admin, nothing special here
 */
router.get('/login', async (req, res) => {
  try {
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
      res.status(200).send(account.name)
    } else {
      res.status(401).send('Y')
    }
  } catch (error) {
    res.status(402).send("'d'")
    console.error(error.message)
  }
})

router.get('/canMakeNewTags', async (req, res) => {
  try {
    const accID = req.session.uid
    const acc = await Account.findById(accID)
    if (acc.isGuest() === true) {
      res.status(200).send(false)
      return
    }
    if (acc.isAdmin() === true) {
      res.status(200).send(true)
      return
    }
    if (acc.reputation >= 50) {
      res.status(200).send(true)
      return
    }
    res.status(200).send(false)
  } catch (error) {
    console.error('Error message can make new Tags:', error.message)
    throw new Error('Account Tag Error')
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
    const acc = await account.save()
    if (!acc) {
      throw new Error('Server Error')
    }
    res.status(200).send('Success')
  } catch (error) {
    if ((error.code = 11000)) {
      res.status(400)
      throw new Error('Email Already Exists')
    } else {
      res.status(500)
      throw new Error('Server Error')
    }
  }
})

/**
 * Returns 0 if regular, 1 if guest, 2 if admin, otherwise error
 */
router.get('/accountType', async (req, res) => {
  try {
    const email = req.session.email
    if (!email) {
      throw new Error('Email is not is session')
    }
    const account = await Account.findOne({ email: email })

    if (!account) {
      throw new Error('Account with email not found')
    }
    if (account.isGuest() === true) {
      res.status(200).json(1)
      return
    } else if (account.isAdmin() === true) {
      res.status(200).json(2)
      return
    } else if (account.isRegularUser() === true) {
      res.status(200).json(0)
      return
    }
    throw new Error('Account is bugged, logout and retry')
  } catch (error) {
    throw error
  }
})

router.get('/getAllQuestions', async (req, res) => {
  try {
    const uid = req.session.uid
    const account = await Account.findById(uid)
    const questions = await account.returnAllQuestions()
    res.status(200).send(questions)
    return
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/:userId/getAllQuestions', async (req, res) => {
  try {
    const uid = req.params.userId
    const account = await Account.findById(uid)
    const questions = await account.returnAllQuestions()
    res.status(200).send(questions)
    return
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/:userId', async (req, res) => {
  try {
    const accID = req.params.userId
    const account = await Account.findById(accID)
    res.status(200).send(account)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/getAllAnswers', async (req, res) => {
  try {
    const uid = req.session.uid
    const account = await Account.findById(uid)
    const answers = await account.returnAllAnswers()
    res.status(200).send(answers)
    return
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/getAllComments', async (req, res) => {
  try {
    const uid = req.session.uid
    const account = await Account.findById(uid)
    const answers = await account.returnAllComments()
    res.status(200).send(answers)
    return
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/getUserData', async (req, res) => {
  try {
    const uid = req.session.uid
    const account = await Account.findById(uid)
    const rep = account.getUserReputation()
    const created_at = account.getUserCreationDate
    res.status(200).send({reputation: rep, created_at: created_at})
    return
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/logout', async (req, res) => {
  try {
    req.session.destroy()
    res.status(200).json(true)
  } catch (error) {
    throw error
  }
})

router.get('/suicide', async (req, res) => {
  try {
    const email = req.session.email
    const account = await Account.findOne({ email: email })
    const val = await account.wipeAllReferences()
    if (val === -1) {
      throw new Error('Server Error')
    } else if (val === 0) {
      throw new Error("Can't delete yourself if you're a guest or an admin")
    } else {
      res.status(200).json(true)
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/getSelf', async (req, res) => {
  try {
    const accID = req.session.uid
    const account = await Account.findById(accID)
    res.status(200).send(account)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router
