// server/index.js

const express = require ('express');
const http = require ('http');
const bodyParser =  require ('body-parser');
const morgan = require ('morgan');
const app = express();
const router = require('./router');
const mongoose = require ('mongoose');

//DB Setup
mongoose.connect("mongodb://localhost:auth/auth");

// App Setup
app.use (morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('API Server is up and running on port',port);
