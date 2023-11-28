const express = require('express');
const router = express.Router();

const Answer = require('../models/answers')

router.get('/', async (req, res) => {
    try {
        const answers = await Answer.find();
        console.log(answers);
        res.send(answers);
        if (!answers) {
            return res.status(404).send('questionS not found');
        }
    } catch (error){
        console.error(error);
    }

})

router.post('/', async (req, res) => {
    try {
        // const tagIds = req.body.tags.map(id => mongoose.Types.ObjectId(id));
        const newAnswer = new Answer({
            text: req.body.text,
            ans_by: req.body.ans_by,
            ask_date_time: new Date()
        })

        await newAnswer.save();
        res.status(201).json(newAnswer);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error answers/post')
    }
})
module.exports = router;