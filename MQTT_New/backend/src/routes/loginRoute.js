const loginController = require('../controller/loginController');
const express = require('express');

const loginRoute = express.Router();

loginRoute.post('/login',loginController.loginWithUUID);

module.exports = loginRoute;