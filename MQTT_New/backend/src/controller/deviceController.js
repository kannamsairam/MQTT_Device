const deviceService = require('../services/deviceService');

exports.createDevice = async (req,res)  => {
    try{
        const deviceData = req.body;
        const deviceResponse = await deviceService.createDevice(deviceData);

        res.status(200).json({
            message: "device registered successfully",
            newDevice: deviceResponse,
        });
    } catch(error){
        
        console.error('Error saving DeviceID:', error.message);
        
        res.status(500).json({
            // message: 'Internal Server error'
            error: error.message
        });
    }
};

exports.getAllDevices = async (req, res) => {
    // const uuid = req.params.userUUID;
    try{
        const { userUUID } =  req.params;
        const devices = await deviceService.getAllDevices(userUUID);

        if (!devices.length) {
            return res.status(404).json({ error: 'No devices found for this user' });
        }

        res.status(200).json(devices);
    } catch(error) {
        console.error('Error fetching all devices:', error.message);
        res.status(500).json({ error: error.message });
    }
}

exports.getDeviceByID = async (req, res) => {
    try{
        const { deviceID } = req.params;
        const device = await deviceService.getDeviceByID(deviceID);

        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        res.status(200).json(device);
    } catch(error) {
        console.error('Error fetching device by ID:', error.message);
        res.status(500).json({ error: error.message });
    }
}

exports.recovery = async (req,res) => {
    try {
        const {mobile} = req.body;
        const user = await deviceService.recovery(mobile);
        
        if(!user) {
            return res.status(404).json({
                error: 'Mobile number not found'
            });
        }
        res.json ({
            user
        })
    } catch(error) {
        console.error('Error fetching user ID', error.message);
        res.status(500).json({
            // message: 'Internal server error'
            error: error.message
        });
    }
}