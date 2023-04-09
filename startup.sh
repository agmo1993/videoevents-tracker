#!/bin/bash

source ./.env

echo "$(date) MESSAGE: Creating the kakfa topic ${TOPIC}"
docker-compose exec broker kafka-topics --create --bootstrap-server \
localhost:9092 --replication-factor 1 --partitions 1 --topic ${TOPIC}

sql_statement=$(cat ./sql/videoevents_stream.sql)
echo "$(date) MESSAGE: Setting up the following ksqldb schema with the following ${sql_statement}"
docker exec ksqldb-cli ksql http://ksqldb-server:8088 --execute "${sql_statement}"

sql_statement=$(cat ./sql/latest_video_time.sql)
echo "$(date) MESSAGE: Setting up the following ksqldb schema with the following ${sql_statement}"
docker exec ksqldb-cli ksql http://ksqldb-server:8088 --execute "${sql_statement}"