var express = require('express');
var mongojs = require('mongojs');
var yelp = require("yelp").createClient({
    consumer_key: "TOFwPVUBOkJhYfrzuvko6A",
    consumer_secret: "sg-E3xiGzotUqwMT4ITSRWI9tFg",
    token: "10eE3QsckF3EjVudmsDs9tFNj0jhAQvZ",
    token_secret: "v9Ybl7xRtZpciQflaoCpvdgUvGo"
});

yelp.search({ term: "food", location: "Montreal" }, function (error, data) {
    console.log(error);
    console.log(data);
});

var app = express();
// serve static content (html, css, js) in the public directory
app.use(express.static(__dirname + '/public'));

// configure express to parse JSON in the body of an HTTP request
app.use(express.bodyParser());

var mongodbConnectionString = process.env.OPENSHIFT_MONGODB_DB_URL + "project";
if(typeof process.env.OPENSHIFT_MONGODB_DB_URL == "undefined") {
	mongodbConnectionString = "newdb" //for local
}

var db = mongojs(mongodbConnectionString, ["comment"]);
var db1 = mongojs(mongodbConnectionString, ["serviceClients"]);

app.get("/getresults/:sterm/:sloc", function (req, res) {
    var sterm = req.params.sterm;
    var sloc = req.params.sloc;
    yelp.search({ term: sterm, location: sloc }, function (error, data) {
        res.json(data);
    });
});

app.get('/env', function(req, res){
	res.json(process.env);

});

//second experiment
app.get("/serviceClients", function (req, res) {
	db1.serviceClients.find(function (err, docs) {
		res.json(docs);
	});
});

// to insert new comment body into database
app.post("/serviceClients", function (req, res) {
	// the serviceClient is in the body of the HTTP request
	var svc = req.body;

	// insert new serviceClient object into the database collection serviceClients
	db1.serviceClients.insert(req.body, function (err, doc) {
		// respond with the new object that has been inserted
		res.json(doc);
	});
});

// to select single comment in order to update it
app.get("/serviceClients/:id", function (req, res) {
	// parse id from the path parameter
	var id = req.params.id;
	// select the single document from the database
	db1.serviceClients.findOne({ _id: mongojs.ObjectId(id) }, function (err, doc) {
		// respond with the document retrieved from the database
		res.json(doc);
	});
});

// handle HTTP PUT request to update comment
app.put("/serviceClients/:id", function (req, res) {
	db1.serviceClients.findAndModify({
		// find the object by id
		query: { _id: mongojs.ObjectId(req.params.id) },
		// new values are in req.body, update it's name
		update: { $set: { name: req.body.name } },
		// single one
		new: true
	}, function(err, doc, lastErrorObject) {
		// respond with the new document
		res.json(doc);
	});
});

// to delete a comment with id passed as a parameter
app.delete("/serviceClients/:id", function (req, res) {
	// parse id from the path parameter
	var id = req.params.id;
	// find the document by id and remove it
	db1.serviceClients.remove({ _id: mongojs.ObjectId(id) },
		function (err, doc) {
			// respond with number of documents affected
			res.json(doc);
		});
});


var ipaddress = process.env.OPENSHIFT_NODEJS_IP|| "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.listen(port, ipaddress);