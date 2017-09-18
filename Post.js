var mongoose = require('mongoose');
var config = require('config');

mongoose.connect(config.get('mongodb'));

var schema = new mongoose.Schema({
  text: String
}, {timestamps: true});

module.exports = mongoose.model('Post', schema);