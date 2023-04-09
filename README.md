# Video tracking server 

Database and API for tracking video playback events per user using kafka and ksqldb.

## Dependencies

- Python [v3.8.9]
- Node.js [v16.17.1]
- Docker [=>v20.10.17] 
- Docker Compose [=>v2.10.2]
- Sqitch [v1.3.1]
- npm [version]

## Start the ksqldb stack

Use docker compose to start the stack,

```sh
source .env
docker-compose up
```
wait for at least one minute until all logs show that ksqldb-server, broker and zookeeper have started. 

Run the following script to create the kafka topics, as well as the required schema in ksqldb.

```
./startup.sh
```

## Install dependencies

```
npm install
```

## Start the server

```
npm run start
```

## Run the server as a docker container

Build the docker container

```
docker build -t vidtracking-server .
```

Start the server by running the container,

```shell
docker run --name vidtracking-server \
-v "$(pwd)"/src:/app/src \
-p 3000:3000 \
--network host \ 
-d vidtracking-server 
```

## Test queries

### Write data to kafka 

```sh
curl -X POST -H "Content-Type: application/json" -d '{"userId": 123, "videoId": 456, "vidTime": 60}' http://localhost:3000/video
```

### Read data for a user

```sh
curl -X GET http://localhost:3000/video/456/123
```

## Integration test 

To run and integration test, the kakfa broker and ksqldb server need to be running, along with the
server.

Start the server 

```
npm start
```

Open another terminal, and run the test

```
npm run test
```

## License

This project is licensed under the MIT License.