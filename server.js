const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const kafka = require('./src/kafka');
const videoAPI = require('./src/videoAPI');
const fs = require("fs");
var helmet = require('helmet');
var cors = require('cors')


//setting config variables from .env 
require('dotenv').config();

//create kafka producer
const producer = kafka.producer({allowAutoTopicCreation: true});

//create kafka consumer
const consumer = kafka.consumer({
  groupId: process.env.GROUP_ID
})

//secure app
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//allow cors
app.use(cors())

// add router in express app
app.use("/",router);

//ksql query url
const url = "http://localhost:8088/query";

//path to ssl certs
const options = {
  key: fs.readFileSync("./ssl/mpec.key"),
  cert: fs.readFileSync("./ssl/mpec.crt")
};

//start the producer and consumer (ksqlDB) API
videoAPI(router, app, producer, url, options).catch(error => {
    console.error(error)
    process.exit(1)
})




