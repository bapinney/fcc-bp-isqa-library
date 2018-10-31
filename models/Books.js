var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: String,
  comments: Array  
});

module.exports = mongoose.model('BookModel', bookSchema );