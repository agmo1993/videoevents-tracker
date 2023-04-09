CREATE STREAM videoevents_stream (videoId INTEGER, userId INTEGER, vidTime INTEGER) 
WITH (kafka_topic='videoevents', value_format='json');