// let userArgs = process.argv.slice(2);

// if (!userArgs[0].startsWith('mongodb://')) {
//     console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
//     return;
// }

let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');
let Account = require('./models/user');
let Comment = require('./models/comments');

let bcrypt = require('bcrypt');
let mongoose = require('mongoose');
const comments = require('./models/comments');
let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, ans_by, comments, username, userId) {
  let answerdetail = { text: text , username: username, userId: userId};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (comments != false) answerdetail.comments = comments;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, summary, text, tags, answers, asked_by, comments, username, userId) {
  let qstndetail = {
    title: title,
    summary: summary,
    text: text,
    tags: tags,
    asked_by: asked_by,
    username: username,
    userId: userId
  };
  if (answers != false) qstndetail.answers = answers;
  if (comments != false) qstndetail.comments = comments;
  qstndetail.views = 0;

  let question = new Question(qstndetail);
  return question.save();
}

function createComment(text, by, username, userId) {
  let com = {
    text: text,
    by: by,
    username: username,
    userId: userId
  };
  let comment = new Comment(com);
  return comment.save();
}

function adminMake() {
  let admin = {
    name: "admin",
    email: process.argv[2],
    password: bcrypt.hashSync(process.argv[3], 5),
  };
  let ad = new Account(admin);
  return ad.save();
}

function guestMake() {
  let guest = {
    name: "guest",
    email: "guest@guest.com",
    password: bcrypt.hashSync("guest", 5),
  };
  let g = new Account(guest);
  return g.save();
}

async function populate() {
  try {
    const admin = await adminMake();
    const guest = await guestMake();
    let tag = await tagCreate('tag');
    let com1 = await createComment("answer", process.argv[2], "admin", admin._id);
    let com2 = await createComment("question", process.argv[2], "admin", admin._id);
    let ans1 = await answerCreate("answer", process.argv[2], com1, "admin", admin._id);
    let q1 = await questionCreate('admin', 'admin summ', 'admin content', tag, ans1, process.argv[2], com2, "admin", admin._id);
    // await adminMake();
    // await guestMake();
    console.log('Database population complete');
  } catch (err) {
    console.error('Error during database population:', err);
  } finally {
    if (db) db.close();
  }
}

populate();
