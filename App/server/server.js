const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const pool = require("./config.js");

server.listen(3000, function() {
	console.log(pool);
});
