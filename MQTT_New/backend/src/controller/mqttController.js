const mqttModel = require('../models/mqttModel');

const { sendRealTimeData } = require('../config/socket'); // Import WebSocket function

// Temporary storage for latest MQTT data
let latestMqttData = {};

// Function to process incoming MQTT messages
function processMqttMessage(topic, message) {
    const data = message.split(',').map(value => (value.trim() === '' ? null : value.trim()));
    const deviceId = data[0];

    if (!deviceId) {
        console.log('Received data without a device ID. Ignoring...');
        return;
    }

    if (!latestMqttData[deviceId]) {
        latestMqttData[deviceId] = {};
    }

    // Update latest data while preserving previous values if new ones are missing
    const fields = [
        'runningHours', 'signalStrength', 'NO2', 'O2', 'CO', 'PM1', 'PM2_5', 'PM10', 'temperature', 'humidity',
        'VOC', 'CO2', 'CH2O', 'O3'
    ];

    latestMqttData[deviceId] = {
        subtopic: topic,
        deviceId,
    };

    fields.forEach((key, index) => {
        const value = data[index + 1] ? parseFloat(data[index + 1]) : latestMqttData[deviceId][key] || 0;
        latestMqttData[deviceId][key] = value;
    });

    console.log(`Emitting real-time data for device ${deviceId}: `, latestMqttData[deviceId]);
    sendRealTimeData(deviceId, latestMqttData[deviceId]); // Send real-time updates via WebSocket
}

// Function to save the latest data at regular intervals
async function saveLatestData() {
    if (Object.keys(latestMqttData).length === 0) {
        console.log('No device data to save at this interval.');
        return;
    }

    console.log('Processing data for saving...');

    for (const deviceId of Object.keys(latestMqttData)) {
        let deviceData = latestMqttData[deviceId];

        // Replace missing or zero values with the last non-zero value from DB
        await Promise.all(
            Object.keys(deviceData).map(async key => {
                if (deviceData[key] === 0 || deviceData[key] === null) {
                    const nonZeroValue = await getLastNonZeroValue(deviceId, key);
                    if (nonZeroValue !== null) {
                        deviceData[key] = nonZeroValue;
                    }
                }
                if (key === "temperature" && deviceData[key] !== null) {
                    const tempStr = deviceData[key].toString();

                    if (tempStr.length === 5) {
                        deviceData[key] = (deviceData[key] / 100).toFixed(2); // Example: 45123 → 451.23
                    } else if (tempStr.length === 4) {
                        deviceData[key] = (deviceData[key] / 100).toFixed(2); // Example: 3714 → 37.14
                    } else if (tempStr.length === 3) {
                        deviceData[key] = (deviceData[key] / 10).toFixed(1); // Example: 314 → 31.4
                    }
                }
            })
        );

        try {
            const mqttData = new mqttModel(deviceData);
            await mqttData.save();
            console.log(`Data saved for device ${deviceId}:`, mqttData);
        } catch (err) {
            console.error('Error saving data to MongoDB:', err);
        }
    }

    // Clear only saved data, keeping other incoming values intact
    latestMqttData = {};
}

// Function to fetch last non-zero value from MongoDB
async function getLastNonZeroValue(deviceId, field) {
    try {
        const record = await mqttModel.findOne({
            deviceId,
            [field]: { $ne: 0 }, // Look for non-zero values
        })
            .sort({ createdAt: -1 }) // Get most recent value
            .exec();

        return record ? record[field] : null;
    } catch (err) {
        console.error('Error querying for non-zero value:', err);
        return null;
    }
}

// Schedule data saving every 2 minutes
setInterval(saveLatestData, 2 * 60 * 1000);

module.exports = { processMqttMessage, latestMqttData };

