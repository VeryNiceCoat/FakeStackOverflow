const express = require('express')
const router = express.Router()

const Comment = require('../models/comments')
const Account = require('../models/user')
const session = require('express-session')

function authManager () {
  async function verify (req, res, next) {
    try {
      const accountID = req.session.uid
      const account = await Account.findById(accountID)

      if (account.isGuest() === true) {
        const error = new Error('Account is Guest')
        error.status = 403
        throw error
      }
      if (!account) {
        const error = new Error('Account with that ID not found')
        throw error
      }

      if (account.reputation === -1) {
        next()
        return
      }

      if (account.email !== req.session.email) {
        const error = new Error(
          'Session email is not the same as the account email'
        )
        throw error
      }
      next()
    } catch (error) {
      next(error)
      return
    }
  }

  return { verify }
}

module.exports = authManager()
