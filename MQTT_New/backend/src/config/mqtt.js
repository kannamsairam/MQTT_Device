require('dotenv').config();
const mqtt = require('mqtt');
const { processMqttMessage } = require('../controller/mqttController');

const brokerUrl = process.env.BROKER_URL;
const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD, 
};

const mqttClient = mqtt.connect(brokerUrl, options);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker successfully');

    mqttClient.subscribe(process.env.TOPIC + "/#", (err) => {
        if (err) {
            console.error('Error subscribing to topic:', err);
        } else {
            console.log(`Subscribed to topic: ${process.env.TOPIC}`);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    console.log(`Received message on topic: ${topic}`);
    processMqttMessage(topic, message.toString());
});

mqttClient.on('error', (err) => {
    console.error('Error connecting to MQTT Broker:', err);
});

module.exports = mqttClient;
