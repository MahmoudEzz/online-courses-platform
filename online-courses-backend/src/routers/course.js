const express = require('express');
const Course = require('../models/course');
const Category = require('../models/category');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// CRUD routes
// Create course
router.post('/courses', isAdmin, async (req, res)=>{
    const course = new Course(req.body);
    
    try {
        await course.save();
        
        // search for categories using array of ids
        const categories = await Category.find().where('_id').in(req.body.categories).exec();
        categories.forEach(async function({_id, courses = []}){
            return await Category.findByIdAndUpdate(_id, { courses: [...courses, course._id]});
        })
        
        await course.populate('categories').execPopulate();

        res.status(201).send(course);
    } catch (e) {
        res.status(400).send(e);
    }
})

// Read course 
router.get('/courses/:id', async (req,res)=>{
    const _id = req.params.id; // Access the id provided
    try {
        const course = await Course.findById(_id);
        if(!course){
            return res.status(404).send('No course available');
        }
        await course.populate('categories').execPopulate();
        res.send(course);

    } catch (e) {
        res.status(500).send(e);
    }
    
})

// Read All courses with pagination -> /courses?skip=0&limit=1
router.get('/courses', async (req,res)=>{
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    try {
        const courses = await Course.find({}).populate('categories')
        .skip(skip)
        .limit(limit);
        
        if(!courses.length){
            return res.status(404).send('No courses available');
        }

        res.send(courses);

    } catch (e) {
        res.status(500).send(e);
    }
    
})

// Update current course 
router.patch('/courses/:id', isAdmin, async (req, res)=>{
    
    const _id = req.params.id; // Access the id provided
    try {
        const course = await Course.findById(_id);
        if (!course) {
            return res.status(404).send()
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'description', 'points', 'categories'];
        const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));

        if (!isValidOperation){
            return res.status(400).send({error: "invalid updates!"});
        }

        updates.forEach((update)=> course[update] = req.body[update]);
        await course.save();

        await course.populate('categories').execPopulate();
        res.send(course);

    } catch (e) {
        res.status(400).send();
    }
    
})

// Delete course
router.delete('/courses/:id', isAdmin, async (req, res)=>{
    const _id = req.params.id; // Access the id provided

    try{
        const course = await Course.findById(_id);
        
        await course.remove();
        res.send(course);
    }catch(e){
        res.status(500).send();
    }
})

module.exports = router;