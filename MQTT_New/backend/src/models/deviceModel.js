const mongoose = require('mongoose');


const deviceSchema = new mongoose.Schema ({ 
    userUUID: {
        type:String, 
        ref: 'user', 
        required: true,
    },
    deviceName: {
        type: String,
        required: true,
    },
    deviceID: {
        type: String,
        required: true,
        unique: true,
    },
    
},
    {timestamps: true}
)

module.exports = mongoose.model('device', deviceSchema)