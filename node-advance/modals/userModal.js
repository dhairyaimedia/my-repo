// Require Mongoose
const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
});

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
