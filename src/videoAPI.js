const axios = require("axios");
const express = require("express");
const Joi = require("joi");
const pino = require("pino");
const router = express.Router();
const kafka = require("./kafka");

// Setting config variables from .env
require("dotenv").config();

// Create Kafka producer
const producer = kafka.producer({ allowAutoTopicCreation: true });

// KSQL query URL
const url = process.env.KSQLDBURL;

// Connect to Kafka server
producer.connect();

// Set up logger
const logger = pino({
  prettyPrint: true,
});

// Define schema for request body validation
const videoEventSchema = Joi.object({
  userId: Joi.number().required(),
  videoId: Joi.number().required(),
  vidTime: Joi.number().required(),
});

// Write data to Kafka topic
router.post("/video", async (req, res) => {
  try {
    // Validate request body
    const { error, value } = videoEventSchema.validate(req.body);
    if (error) {
      logger.error("Invalid request body:", error);
      return res.status(400).send("Invalid request body");
    }

    logger.info(
      `Video event pushed for User ${value.userId} for video ${value.videoId} with ${value.vidTime}`
    );

    const responses = await producer.send({
      topic: process.env.TOPIC,
      messages: [
        {
          // Name of the published package as key, to make sure that we process events in order
          key: value.userId,

          // The message value is just bytes to Kafka, so we need to serialize our JavaScript
          // object to a JSON string. Other serialization methods like Avro are available.
          value: JSON.stringify({
            userId: parseInt(value.userId),
            videoId: parseInt(value.videoId),
            vidTime: parseInt(value.vidTime),
          }),
        },
      ],
    });
  } catch (error) {
    logger.error("Error publishing message:", error);
    return res.status(500).send("Error publishing message");
  }
  res.end("yes");
});

// Define schema for request parameters validation
const videoTimeSchema = Joi.object({
  vidId: Joi.number().required(),
  userId: Joi.number().required(),
});

router.get("/video/:vidId/:userId", async (req, res) => {
  try {
    // Validate request parameters
    const { error, value } = videoTimeSchema.validate(req.params);
    if (error) {
      logger.error("Invalid request parameters:", error);
      return res.status(400).send("Invalid request parameters");
    }

    logger.info(
      `Video time request for VideoId: ${value.vidId} UserId: ${value.userId}`
    );

    const data = {
      ksql: `SELECT VIDEOTIME FROM latest_video_time WHERE videoid = ${value.vidId} AND userId = ${value.userId};`,
    };
    const response = await axios.post(url, data);
    res.status(200).send({ videotime: response.data[1].row.columns[0] });
  } catch (error) {
    logger.error(
      `Error getting video time for VideoId: ${req.params.vidId} UserId: ${req.params.userId}:`,
      error
    );
    res.status(404).send({
      response: `No data found for videoId ${req.params.vidId} and userId ${req.params.userId}`,
    });
  }
});

module.exports = router;
