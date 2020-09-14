const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    points: {
        type: Number,
        required: true
    },
    categories: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: 'Category'
        }
    ],
    image: {
        type: String,
    }
},{
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;