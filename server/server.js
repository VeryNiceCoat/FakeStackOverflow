// Application server


// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const cors = require('cors');
var mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

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
app.use(cors({
    origin: 'http://localhost:3000' 
}));

app.use(cookieParser());

app.use(cookieSession({
    keys: ['secret']
}));

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
app.use('/questions', questionsRoute);
app.use('/answers', answersRoute);
app.use('/tags', tagsRoute);

app.get('/', (req,res) =>{
// const y = bcrypt.hashSync("guest", 5);
// const z = bcrypt.compareSync("guest", y);
// console.log(z);
// res.send(z);
    res.send('hello');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

// const x = bcrypt.hashSync("guest", 5);
// const y = bcrypt.hashSync("guest", 5);
// const z = bcrypt.compareSync("guest", y);
// console.log(z);