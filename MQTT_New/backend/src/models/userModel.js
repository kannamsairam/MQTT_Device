const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');  // Import UUID generator

const userSchema = new mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        default: uuidv4, // Generates a unique UUID
    },
    userName: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    Organization: {
        type: String,
        required: true,
    },
    NumberofDevices: {
        type: Number,
        default: 0,
    },
})

module.exports = mongoose.model('user', userSchema);