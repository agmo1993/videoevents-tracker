const axios = require("axios");
const express = require("express");
const router = express.Router();
const kafka = require('./kafka');


//setting config variables from .env 
require('dotenv').config();

//create kafka producer
const producer = kafka.producer({allowAutoTopicCreation: true});

//ksql query url
const url = process.env.KSQLDBURL;

//connect to kafka server
producer.connect();
    
//write data to kafka topic
router.post("/video", async(req, res) => {
    try {
        console.log(`Videoevent pushed for User ${req['userId']} for video ${req['videoId']} with ${req['vidTime']}`);
        //console.log(`Topic name is ${req}`);
        const responses = await producer.send({
          
          topic: process.env.TOPIC,
          messages: [{
            // Name of the published package as key, to make sure that we process events in order
            key: req.body.userId,
    
            // The message value is just bytes to Kafka, so we need to serialize our JavaScript
            // object to a JSON string. Other serialization methods like Avro are available.
            value: JSON.stringify({
              userId: parseInt(req.body.userId),
              videoId: parseInt(req.body.videoId),
              vidTime: parseInt(req.body.vidTime),
            })
          }]
        })
      } catch (error) {
        console.error('Error publishing message', error)
      }
    res.end("yes");
});

router.get("/video/:vidId/:userId", async(req, res) => {
    console.log(`Videotime request for VideoId: ${req.params['vidId']} UserId: ${req.params['userId']}`);
    let data =  { "ksql" : `SELECT VIDEOTIME FROM latest_video_time WHERE videoid = ${req.params['vidId']} AND userId = ${req.params['userId']};`};
    axios.post(url, data)
          .then(data => {
            res.status(200).send({"videotime" : data.data[1].row.columns[0]})
          })
          .catch(error => res.status(404).send({"response" : `No data found for videoId ${req.params['vidId']} and userId ${req.params['userId']}`}));
})

module.exports = router;