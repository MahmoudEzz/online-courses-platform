const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Course = require('./course');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Not a valid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Not valid, contains password');
            }
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    score: {
        type: Number,
        default: 0,
        validate(value){
            if(value<0){
                throw new Error('Score must be a postive number');
            }
        }
    },
    registeredCourses: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: 'Course'
        }
    ],
    finishedCourses: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: 'Course'
        }
    ],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});


// Instance method (user object)
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);

    user.tokens.push({token});
    await user.save();

    return token;
}

userSchema.methods.toJSON = function(){
    const user = this;

    const userObject = user.toObject();
    
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

// Model method (static)
userSchema.statics.findByCredentials = async (email, password)=>{
    
    const user = await User.findOne({email});
    if(!user){
        throw new Error("Unable to connect");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        throw new Error("Unable to connect");
    }
    
    return user;
}

// Hash plain text before saving Model middleware for create and update user
userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    
    next();
})


const User = mongoose.model('User', userSchema);

module.exports = User;