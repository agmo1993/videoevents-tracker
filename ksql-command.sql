--Turns raw kafka stream into structured stream
CREATE STREAM videoevents_stream (videoId INTEGER, userId INTEGER, vidTime INTEGER) \
WITH (kafka_topic='videoevents', value_format='json');

--Create a materialized view per userid and videoid
CREATE TABLE latest_video_time WITH (KEY_FORMAT='DELIMITED') AS SELECT \ 
videoId, \
userID, \
LATEST_BY_OFFSET(vidTime) as videoTime \
FROM videoevents_stream \
GROUP BY videoId, userID \
EMIT CHANGES;