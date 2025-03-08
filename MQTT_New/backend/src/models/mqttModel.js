const mongoose = require('mongoose');

const mqttDataSchema = new mongoose.Schema({
    subtopic: {type: String, required: true, },
    deviceId: {type: String, required: true, },
    runningHours: {type: Number, },
    signalStrength: {type: Number},
    NO2: {type: Number, },
    O2: {type: Number, },
    CO: {type: Number, },
    PM1: {type: Number,},
    PM2_5: {type: Number,},
    PM10: {type: Number,},
    temperature: {type: Number,},
    humidity: {type: Number,},
    VOC: {type: Number,},
    CO2: {type: Number,},
    CH2O: {type: Number, },
    O3: {type: Number, },
}, {timestamps: true}
);

module.exports = mongoose.model('MqttData', mqttDataSchema);
