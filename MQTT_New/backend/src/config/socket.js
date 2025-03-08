const { Server } = require("socket.io");
const mqttModel = require("../models/mqttModel");

let io;
const lastNonZeroCache = {}; //For in-memory cache for last nonzero values

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods:["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);

        //Client subscribing to device ID
        socket.on("subscribeToDevice", (deviceID) => {
            console.log(`Client subscribed to device: ${deviceID}`);
            socket.join(deviceID);
        });
    });
}

async function sendRealTimeData(deviceID, data) {
    if(!io) {
        console.log(`[${new Date().toISOString()}] Websocket not initialized`);
        return;
    }

    if(!lastNonZeroCache[deviceID]){
        lastNonZeroCache[deviceID] = {};
    }

    const updatedData = {...data};

    await Promise.all(
        Object.keys(updatedData).map(async (key) => {
            if(updatedData[key] === 0 || updatedData[key] === null ){
                if(lastNonZeroCache[deviceID][key] !== undefined){
                    //using cached nonzero value
                    updatedData[key]= lastNonZeroCache[deviceID][key];
                } else {
                    // Fetch from DB if not in cache
                    const lastValue = await getLastNonZeroValue(deviceID, key);
                    if(lastValue!== null){
                        updatedData[key] = lastValue;
                        lastNonZeroCache[deviceID][key] = lastValue; // Store in cache
                    }
                }
            } else {
                // Updating  cache with latest non-zero values
                lastNonZeroCache[deviceID][key] = updatedData[key];
            }

            //Inserting decimal point at ten's place for temperature
            // if(key === "temperature" && updatedData[key]>9){
            //     updatedData[key] = (updatedData[key] /10). toFixed(1);
            // }
            if (key === "temperature") {
                const tempStr = updatedData[key].toString(); // Convert number to string

                if (tempStr.length === 5) {
                    updatedData[key] = (updatedData[key] / 1000).toFixed(2); // Example: 45123 → 45.123
                } else if (tempStr.length === 4) {
                    updatedData[key] = (updatedData[key] / 100).toFixed(2); // Example: 3714 → 37.14
                } else if (tempStr.length === 3) {
                    updatedData[key] = (updatedData[key] / 10).toFixed(1); // Example: 180 → 18.0
                }
            }
        })
    );
    console.log(`[${new Date().toISOString()}] Emitting real-time data for device ${deviceID}:`, updatedData);
    io.to(deviceID).emit("realTimeData", updatedData);
}

//Function for fetching last nonzero value from MongoDB
async function getLastNonZeroValue(deviceID, field) {
    try {
        const record = await mqttModel.findOne({
            deviceID,
            [field]: {$ne: 0},
        })
            .sort({ createdAt: -1 })
            .exec();
            return record? record[field] : null;
    } catch(error) {
        console.error(`[${new Date().toISOString()}] Error querying non-zero value:`, error);
        return null;
    }
}

module.exports = {initializeSocket, sendRealTimeData};


