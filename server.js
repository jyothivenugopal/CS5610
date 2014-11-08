var express = require('express');
var mongojs = require('mongojs');
var app = express();

// serve static content (html, css, js) in the public directory
app.use(express.static(__dirname + '/public'));

// configure express to parse JSON in the body of an HTTP request
app.use(express.bodyParser());

var mongodbConnectionString = process.env.OPENSHIFT_MONGODB_DB_URL + "project";
if (typeof process.env.OPENSHIFT_MONGODB_DB_URL == "undefined") {
    mongodbConnectionString = "project" //for local
}

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var db = mongojs(mongodbConnectionString, ["comment"]);

app.get("/hello", function (req, res) {
    res.send("Hello World")
});

    app.listen(port, ipaddress);