const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: String,
    qualifications: String,
    resume: String, // Store resume file path
});

const User = mongoose.model('User', userSchema);
module.exports = User;
