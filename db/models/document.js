var db = require('../config');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var documentSchema = new Schema({
	title: String,
	code: String,
	text: String,
	creator: String,
  timestamps: { type: Date, default: Date.now}
});

var Document = mongoose.model('User', documentSchema)

module.exports = Document;