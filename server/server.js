const express = require('express')
const cors = require('cors')
var mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const port = 8000

var mongoDB = 'mongodb://127.0.0.1:27017/fake_so'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

/**
 * Makes express application, and sets it so only 3000 can send requests
 */
const app = express()

// var secret = 'secret'

app.use(cookieParser())
const corsOptionsDelegate = function (req, callback) {
  const corsOptions = {
    origin: true,
    credentials: true
  }
  callback(null, corsOptions)
}
app.use(cors(corsOptionsDelegate))

app.use(
  session({
    secret: `string`,
    cookie: {maxAge: 99999999},
    resave: false,
    saveUninitialized: false,
    secure: false,
  })
)

// app.get('/temp', (req, res) => {
//   req.cookies = "temp"
//   res.send(req.cookies)
// })

/**
 * Sets up values to be in JSON and work automaticaly
 */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/**
 * Loads questions, answer, and tags route to be loaded for GET requests
 */
const questionsRoute = require('./routes/questionsRoute')
const answersRoute = require('./routes/answersRoute')
const tagsRoute = require('./routes/tagsRoute')
const usersRoute = require('./routes/userRoute')
const commentsRoute = require('./routes/commentsRoute')
app.use('/questions', questionsRoute)
app.use('/answers', answersRoute)
app.use('/tags', tagsRoute)
app.use('/users', usersRoute)
app.use('/comments', commentsRoute)

app.get('/', (req, res) => {
  // req.session.name = "name";
  res.send('hello')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
