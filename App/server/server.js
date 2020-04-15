const express = require("express");
const bodyParser = require("body-parser");
const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
const db = require("./queries");
const userViewDB = require("./userViewQueries");


// Business Data
server.get("/getStates", db.getStates);
server.get("/getCities", db.getCities);
server.get("/getZipcodes", db.getZipcodes);
server.get("/getCategories", db.getCatagories);
server.get("/getBusinesses", db.getBusinesses);
server.get("/getBusinessID", db.getBusinessID);
// User Data
server.get("/getUserIDs", userViewDB.getUserIDs);
server.get("/getUser", userViewDB.getUser);
server.get("/getFriends", userViewDB.getFriends);
server.get("/getFriendsTips", userViewDB.getFriendsTips);
// Business/User Data
server.get("/getTips", db.getTips);
server.post("/postTip", db.postTip);

server.listen(3000, function() {
	console.log("Listening in on Port 3000");
});
