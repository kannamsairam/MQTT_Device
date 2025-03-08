const userModel = require('../models/userModel');

exports.createUser = async (userData) => {
    const { mobile } = userData;

    const existingUser = await userModel.findOne({ mobile });
    if (existingUser) {
        throw new Error('User already registered!')
    }

    const newUser = new userModel(userData);
    return await newUser.save();
}