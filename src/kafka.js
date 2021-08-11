const { Kafka } = require('kafkajs')
require('dotenv').config();

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: 'ecppp-server-test',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER]
})

module.exports = kafka;