const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

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

router.get('/:tagID', async (req, res) => {
    try {
        req.session.user_id = 123
        const tagID = new mongoose.Types.ObjectId(req.params.tagID);
        const tag = await Tag.findById(tagID)
            .populate('name')
        if (!tag) {
            return res.status(404).send('tag not found')
        }
        res.send(tag)
        } catch (error) {
        console.error(error.message)
        res.status(500).send('server Error tags/tagID   ')
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