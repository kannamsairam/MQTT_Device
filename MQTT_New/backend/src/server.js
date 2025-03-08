require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/database');
const http = require('http');
const cors = require('cors');
require('./config/mqtt');

const server = http.createServer(app);
const { initializeSocket } = require("./config/socket");
initializeSocket(server);

db();

app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const loginRoutes = require('./routes/loginRoute');

app.use('/user', userRoutes);
app.use('/device',deviceRoutes);
app.use('/auth',loginRoutes);


const PORT = process.env.PORT;
server.listen( PORT || 6000 , () =>{
    console.log(`Server running on port ${PORT}`);
} )