const axios = require("axios");
const { Kafka } = require("kafkajs");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Setting up the Kafka producer
const kafka = new Kafka({
    clientId: uuidv4(),
    brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
});

const producer = kafka.producer({ allowAutoTopicCreation: true });

beforeAll(async () => {
    // Connect the Kafka producer before running the tests
    await producer.connect();
});

afterAll(async () => {
    // Disconnect the Kafka producer after running the tests
    await producer.disconnect();
});

describe("Integration tests for the API", () => {
    it("POST /video should write data to Kafka topic", async () => {
        const payload = {
            userId: 123,
            videoId: 456,
            vidTime: 60
        };

        const res = await axios.post("http://localhost:3000/video", payload);

        expect(res.status).toBe(200);
    });

    it("GET /video/:vidId/:userId should return video time for a user", async () => {
        const res = await axios.get("http://localhost:3000/video/456/123");

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("videotime");
        expect(res.data.videotime).toBeDefined();
    });
});
