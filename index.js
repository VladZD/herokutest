var express = require('express');
var bodyParser = require('body-parser');
var config = require('config');
var path = require('path');
var posts = require('./posts');

var app = express();

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json());

app.use('/api/posts', posts);

app.listen(process.env.PORT || 3000);