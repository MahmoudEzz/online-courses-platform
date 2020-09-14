const express = require('express');
const User = require('../models/user');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// Login router
router.post('/users/login', async (req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
        
    } catch (e) {
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token );
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})
router.post('/admins/logout', isAdmin, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token );
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

// CRUD routes
// Create user
router.post('/users', async (req, res)=>{

    if (!isValidOperation(req.body, ['name', 'email', 'password'])){
        return res.status(400).send({error: "invalid inputs!"});
    }
    // create user
    const user = new User(req.body);
    
    try {
        await user.save();
        const token = await user.generateAuthToken();

        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
})

// Read current user profile
router.get('/users/me', auth, async (req,res)=>{
    try {
        await req.user.populate('registeredCourses')
            .populate('finishedCourses')
            .execPopulate();
    } catch (error) {
        res.status(400).send(e);
    }
    res.send(req.user);
    
})

// Update current user profile
router.patch('/users/me', auth, async (req, res)=>{
    
    if (!isValidOperation(req.body, ['name', 'email', 'password'])){
        return res.status(400).send({error: "invalid updates!"});
    }

    try {
        
        updates.forEach((update)=> req.user[update] = req.body[update]);
        await req.user.save();

        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/me', auth, async (req, res)=>{
    
    try{
        await req.user.remove();
        res.send(req.user);
    }catch(e){
        res.status(500).send();
    }
})

// User
// Register on course
router.patch('/users/course/register/:id', auth, async (req, res)=>{
    const _id = req.params.id;
    const userCourses = req.user.registeredCourses;
    try {
        const course = await Course.findById(_id);
        if (!course){
            return res.status(404).send({error: 'course not found'});
        }
        if(userCourses.includes(_id)){
            return res.status(400).send({error: 'Already registered'});
        } 
        req.user.registeredCourses = [...userCourses, _id];
        await req.user.save();
        await req.user.populate('registeredCourses')
            .populate('finishedCourses')
            .execPopulate();
        res.send(req.user);
    } catch (e) {
       res.status(400).send(); 
    }
})

// Cancel registeration
router.patch('/users/course/cancel/:id', auth, async (req, res)=>{
    const _id = req.params.id;
    const userCourses = req.user.registeredCourses;
    try {
        const course = await Course.findById(_id);
        if (!course){
            return res.status(404).send({error: 'course not found'});
        }
        if(!userCourses.includes(_id)){
            return res.status(404).send({error: 'this user course not found'});
        } 
        req.user.registeredCourses = userCourses.filter((course)=> course != _id );
        await req.user.save();
        await req.user.populate('registeredCourses')
            .populate('finishedCourses')
            .execPopulate();
        res.send(req.user);
    } catch (e) {
       res.status(400).send(); 
    }
})

// Finish course
router.patch('/users/course/finish/:id', auth, async (req, res)=>{
    const _id = req.params.id;
    const finishedCourses = req.user.finishedCourses;
    const userCourses = req.user.registeredCourses;
    try {
        const course = await Course.findById(_id);
        if (!course){
            return res.status(404).send({error: 'course not found'});
        }
        if(finishedCourses.includes(_id)){
            return res.status(400).send({error: 'Already finished'});
        }
        // Add to finished courses
        req.user.finishedCourses = [...finishedCourses, _id];
        // Remove from registered
        req.user.registeredCourses = userCourses.filter((course)=> course != _id );
        // Add to his score
        req.user.score += course.points;
        await req.user.save();
        await req.user.populate('registeredCourses')
            .populate('finishedCourses')
            .execPopulate();
        res.send(req.user);
    } catch (e) {
       res.status(400).send(); 
    }
})

// Admin roles
// Create admin
router.post('/users/admin', isAdmin, async (req, res)=>{
    
    if (!isValidOperation(req.body, ['name', 'email', 'password'])){
        return res.status(400).send({error: "invalid inputs!"});
    }
    
    req.body.isAdmin = true;
    const user = new User(req.body);
    
    try {
        await user.save();

        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})
// Activate and deactivate users
router.patch('/users/activate/:id', isAdmin, async (req, res)=>{
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        user.isActive = user.isActive?false:true;
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})

// read all users
router.get('/users', isAdmin, async (req,res)=>{
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    try {
        const users = await User.find({})
            .skip(skip)
            .limit(limit);
        if(!users.length){
            return res.status(404).send('No users available');
        }
        res.send(users);
    } catch (error) {
        res.status(400).send(e);
    }
    
})

// Read loged in user data
router.get('/me', auth, async (req,res)=>{
    res.send(req.user);
})
router.get('/admin/me', isAdmin, async (req,res)=>{
    res.send(req.user);
})

// validate inputs function
const isValidOperation = function(body, allowedUpdates){
    const updates = Object.keys(body);
    return updates.every((update)=> allowedUpdates.includes(update));
}



module.exports = router;