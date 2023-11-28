const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Question = require('../models/questions')
const Tag = require('../models/tags')
//fetch questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        console.log(questions);
        res.send(questions);
        if (!questions) {
            return res.status(404).send('questionS not found');
        }
    } catch (error){
        console.error(error);
    }

})

/**
 * QID Route
 */
router.get('/:questionID', async (req, res) => {
    try {
        const questionID = req.params.questionID;
        const question = await Question.findById(questionID).populate('tags').populate('answers');
        if (!question) {
            return res.status(404).send('question not found');
        }
        // res.json(question);
        res.send(question);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server Error questions/getID   ');
    }
});

/**
 * This should be where question sort should happen
 */
router.get('/questionSearch', async (req, rex) => {
    try {
        const questions = await Question.find();
        console.log(questions);
    } catch (error) {
        console.error(error);
    }
});

//make new question
router.post('/', async (req, res) => {
    try {
        // const tagIds = req.body.tags.map(id => mongoose.Types.ObjectId(id));
        const newQuestion = new Question({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            asked_by: req.body.asked_by,
            ask_date_time: new Date()
        })

        await newQuestion.save();
        res.status(201).json(newQuestion);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error questions/post');
    }
})

router.put(`/:questionID`, async(req, res) => {
    try {
        const questionID = new mongoose.Types.ObjectId(req.params.questionID);
        const answerID = new mongoose.Types.ObjectId(req.body.answerID);  // Make sure you're getting the answerID from the request body
        
        console.log(questionID);
        console.log(answerID);
        // Find the question
        const question = await Question.findById(questionID);
        if (!question) {
            return res.status(404).send('Question not found');
        }
    
        // add the answerID to the answers array
        question.answers.push(answerID);
        console.log(question);
        const updatedQuestion = await question.save();
        console.log(updatedQuestion);
        res.status(200).json(updatedQuestion);
    } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error on questions/put');
    }
})

router.put('/:questionID/views', async (req, res) => {
    try {
        const questionID = req.params.questionID;
        const question = await Question.findById(questionID);
        if (!question) {
            return res.status(404).send('Question not found');
        }

        question.views += 1; // Increment views
        const updatedQuestion = await question.save();

        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(500).send('Server error on questions view update');
    }
})

module.exports = router;