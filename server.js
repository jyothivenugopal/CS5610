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

app.get('/getAllComments', function (req, res) {
    db.comment.find(function (err, data) {
        res.json(data);
    });
});


app.get('/getCommentsById/:id', function (req, res) {
    var id = req.params.id;
    db.comment.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });


});

app.get('/removeCommentById/:id', function (req, res) {
    db.comment.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, function (err, doc) {
        res.json(doc);
    });

});

app.get('/removeCommentByName/:lastName', function (req, res) {
    db.comment.remove({
        last: req.params.lastName
    }, false, function (err, doc) {
        res.json(doc);
    });

});


app.get('/updateComment/:id', function (req, res) {

    console.log(req.query);
    var cbody = req.query.cbody;

    db.comment.findAndModify({
        query: { _id: mongojs.ObjectId(req.params.id) },
        update: { $set: { cbody: cbody } },
        new: true
    }, function (err, doc, lastErrorObject) {
        //res.json(doc);
        db.comment.find(function (err, data) {
            res.json(data);
        });


    });
});

app.get('/createComment', function (req, res) {

    console.log(req.query);
    var comment = {
        cname: req.query.cname,
        chead: req.query.chead,
        cbody: req.query.cbody
    };

    db.comment.insert(comment, function (err, data) {
        console.log(err);
        console.log(data);
        res.json(data);
    });
});


    app.listen(port, ipaddress);