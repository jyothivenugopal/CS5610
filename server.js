var express = require('express');
var mongojs = require('mongojs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose/');

mongoose.connect('mongodb://localhost/project');

var Schema = mongoose.Schema;
var UserDetail = new Schema({
    username: String,
    password: String
}, {
    collection: 'userInfo'
});
var UserDetails = mongoose.model('userInfo', UserDetail);

//var Client = require('node-rest-client').Client;
//var https = require('https');

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

//client = new Client();

var app = express();
app.use(passport.initialize());
app.use(passport.session());
// serve static content (html, css, js) in the public directory
app.use(express.static(__dirname + '/public'));

// configure express to parse JSON in the body of an HTTP request
app.use(express.bodyParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

app.get('/login', function (req, res) {
    res.sendfile('public/login.html');
});

app.post('/login',
  passport.authenticate('local', {
      successRedirect: '/loginSuccess',
      failureRedirect: '/loginFailure'
  })
);

app.get('/loginFailure', function (req, res, next) {
    res.send('Failed to authenticate');
});

app.get('/loginSuccess', function (req, res, next) {
    res.sendfile('public/Afterlogin.html');
    //res.send('Successfully authenticated');
});

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function (username, password, done) {
    process.nextTick(function () {
        UserDetails.findOne({
            'username': username,
        }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (user.password != password) {
                return done(null, false);
            }

            return done(null, user);
        });
    });
}));


/*app.get("/Uberresults", function (req, res) {
    //console.log("from server")
    //var prodURL = "https://api.uber.com/v1/products?client_id=J2z1kmygRGKmvem0kFJczeJ4bA8I8o1r&client_secret=PS4vjomIGnaYm4iZ2RQUCPtUOYw6wwofBQ9LtQOX&server_token=VMSBIWPv7tRD5PpIPrLEVIa8ahfpMgs9FxxRM67f&latitude=37.7759792&longitude=-122.41823";

    // direct way
    client.get("https://api.uber.com/v1/products?client_id=J2z1kmygRGKmvem0kFJczeJ4bA8I8o1r&client_secret=PS4vjomIGnaYm4iZ2RQUCPtUOYw6wwofBQ9LtQOX&server_token=VMSBIWPv7tRD5PpIPrLEVIa8ahfpMgs9FxxRM67f&latitude=37.7759792&longitude=-122.41823", function (data, response) {
        // parsed response body as js object
        //console.log(data);
        // raw response
        //console.log(response);
        res.json(data);
    });
    /*end of new part
    //res.send("hi");
});*/



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