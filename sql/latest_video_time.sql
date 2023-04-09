CREATE TABLE latest_video_time WITH (KEY_FORMAT='DELIMITED') AS SELECT 
videoId,
userID,
LATEST_BY_OFFSET(vidTime) as videoTime
FROM videoevents_stream
GROUP BY videoId, userID
EMIT CHANGES;