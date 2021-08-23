const routes = require('./src/videoAPI');
const fs = require("fs");
const https = require("https");
const express = require("express");
var helmet = require('helmet');
const bodyParser = require("body-parser");


const app = express();
var cors = require('cors')

//secure app
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//allow cors
app.use(cors())

// add router in express app
app.use("/",routes);

//path to ssl certs
const options = {
  key: fs.readFileSync("./ssl/mpec.key"),
  cert: fs.readFileSync("./ssl/mpec.crt")
};

https.createServer(options, app).listen(process.env.PORT,() => {
  console.log(`Started on PORT ${process.env.PORT}`);
});

module.exports = app;

