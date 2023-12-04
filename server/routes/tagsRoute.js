const express = require('express');
const router = express.Router();

const Tag = require('../models/tags')

router.get('/', async (req,res) => {
    try {
        const tags = await Tag.find();
        res.send(tags);
        if (!tags) {
            return res.status(404).send('Tags not found, tags/get');
        }
    } catch (error){
        console.error(error);
    }
})

router.post('/', async (req, res) => {
    try {
        const name = req.body.name;
        let tag = new Tag({name: name});
        await tag.save();
        //201 means resourec created.
        res.status(201).json(tag);
    } catch (error){
        console.error(error.message);
        res.status(500).send('Server error tags/post')
    }
})

module.exports = router;