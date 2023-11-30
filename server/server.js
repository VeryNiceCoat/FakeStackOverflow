// Application server


// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const cors = require('cors');
var mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const port = 8000;

//basically code that kane explained
var mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Makes express application, and sets it so only 3000 can send requests
 */
const app = express();

app.use(
  session({
    secret: "supersecret difficult to guess string",
    cookie: {},
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/sessions'})
  })
);

const corsOptionsDelegate = function (req, callback) {
    const corsOptions = {
      origin: true, // reflect (enable) the requested origin in the CORS response
      credentials: true // to allow cookies and credentials
    };
    callback(null, corsOptions); // callback expects two parameters: error and options
  };
  
app.use(cors(corsOptionsDelegate));

// app.use(cors({
//     origin: 'http://localhost:3000' 
// }));

app.use(cookieParser());

// app.use(cookieSession({
//     keys: ['secret']
// }));

/**
 * Sets up values to be in JSON and work automaticaly
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Loads questions, answer, and tags route to be loaded for GET requests
 */
const questionsRoute = require('./routes/questionsRoute');
const answersRoute = require('./routes/answersRoute');
const tagsRoute = require('./routes/tagsRoute');
const usersRoute = require('./routes/userRoute');
const commentsRoute = require('./routes/commentsRoute');
app.use('/questions', questionsRoute);
app.use('/answers', answersRoute);
app.use('/tags', tagsRoute);
app.use('/users', usersRoute);
app.use('/comments', commentsRoute);

app.get('/', (req,res) =>{

    res.send('hello');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

// const x = bcrypt.hashSync("guest", 5);
// const y = bcrypt.hashSync("guest", 5);
// const z = bcrypt.compareSync("guest", y);
// console.log(z);