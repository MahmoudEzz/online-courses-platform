const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    courses: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            ref: 'Course'
        }
    ]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;