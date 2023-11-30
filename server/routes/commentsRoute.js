const express = require('express');
const router = express.Router();

const Comment = require('../models/comments');

router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        
        res.send(comments);
    } catch (error) {
        res.status(500).send("error");
    }
})

module.exports = router;