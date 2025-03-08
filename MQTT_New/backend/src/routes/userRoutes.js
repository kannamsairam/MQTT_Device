const userController = require('../controller/userController');
const express = require('express');

const userRouter = express.Router();

userRouter.post('/create-user', userController.createUser);

module.exports = userRouter;