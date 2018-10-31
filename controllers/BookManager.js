const Books = require("../models/Books.js");

var mongodb = require("mongodb");
var client = mongodb.MongoClient;
var url = process.env.DB;


class BookManager {
  
  constructor(mongoosedb) {
    this.db = mongoosedb;
  }
  
  addBook(title) {
    return new Promise((resolve, reject) => {
      console.log("addBook called for " + title + ".");
      var book = new Books({
          title: title,
          comments: []
      });
      console.log("new model");
      book.save().then(doc => {
        resolve(doc);
      }).catch(err => {
            console.err(err);
            reject(err);          
          })
      });      
  }
  
}

module.exports = BookManager;

