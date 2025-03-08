const deviceController = require('../controller/deviceController');
const express = require('express');

const deviceRouter = express.Router();

deviceRouter.post('/device-Register', deviceController.createDevice);
deviceRouter.get('/recover-user', deviceController.recovery);

deviceRouter.get('/ByID/:deviceID', deviceController.getDeviceByID);
deviceRouter.get('/:userUUID', deviceController.getAllDevices);


module.exports = deviceRouter;