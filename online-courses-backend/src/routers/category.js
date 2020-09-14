const express = require('express');
const Category = require('../models/category');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// CRUD routes
// Create category
router.post('/categories', isAdmin, async (req, res)=>{
    const category = new Category(req.body);
    
    try {
        await category.save();

        res.status(201).send(category);
    } catch (e) {
        res.status(400).send(e);
    }
})

// Read category 
router.get('/categories/:id', async (req,res)=>{
    const _id = req.params.id; // Access the id provided
    try {
        const category = await Category.findById(_id);
        if(!category){
            return res.status(404).send('No category available');
        }
        await category.populate('courses').execPopulate();
        res.send(category);

    } catch (e) {
        res.status(500).send(e);
    }
    
})

// Read All categories with pagination -> /categories?skip=0&limit=1
router.get('/categories', async (req,res)=>{
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    try {
        const categories = await Category.find({})
        .skip(skip)
        .limit(limit);

        if(!categories.length){
            return res.status(404).send('No categories available');
        }
        res.send(categories);

    } catch (e) {
        res.status(500).send(e);
    }
    
})

// Update current category 
router.patch('/categories/:id', isAdmin, async (req, res)=>{
    
    const _id = req.params.id; // Access the id provided
    try {
        const category = await Category.findById(_id);
        if (!category) {
            return res.status(404).send()
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ['name'];
        const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

        if (!isValidOperation){
            return res.status(400).send({error: "invalid updates!"});
        }

        category.name = req.body.name;
        await category.save();
        
        res.send(category);

    } catch (e) {
        res.status(400).send();
    }
    
})

// Delete category
router.delete('/categories/:id', isAdmin, async (req, res)=>{
    const _id = req.params.id; // Access the id provided

    try{
        const category = await Category.findById(_id);
        await category.remove();
        res.send(category);
    }catch(e){
        res.status(500).send();
    }
})

module.exports = router;