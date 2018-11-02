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
  
  addComment(bookId, comment) {
    return new Promise((resolve, reject) => {
      console.log("addComment called for " + bookId + ".");
      Books.findById(bookId, function(err, book) {
        if (err) {
          //console.dir(err);
          reject("Unable to add comment");
        }
        book.comments.push(comment);
        book.save().then(doc => {
          resolve(doc);
        }).catch(err => {
            console.err(err);
            reject(err);
          })
      });
    });
  }
  
  deleteAll() {
    return new Promise((resolve, reject) => {
      Books.remove({}, function (err) {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }
  
  deleteBook(bookId) {
    return new Promise((resolve, reject) => {
      Books.findByIdAndRemove(bookId, function(err, book) {
        if (err) {
          //console.dir(err);
          reject("Unable to fetch book for deletion");
        }
        resolve(book);
      });
    });
  }
  
  getBook(bookId) {
    return new Promise((resolve, reject) => {
      Books.findById(bookId, function(err, book) {
        if (err) {
          console.dir(err);
          reject("Unable to find or fetch book");
        }
        resolve(book);
      });
    });
  }
  
  listBooks() {
    console.log("listbooks called");
    return new Promise((resolve, reject) => {
      Books.aggregate([
          {$match: {}}, 
          {$project: { _id: 1, title: 1, commentcount: { $size: "$comments"}}}])
      .exec(function (err, res) {
        if (err) {reject(err);}
        resolve(res); // [ { maxBalance: 98 } ]
        });
    });
  }
}

module.exports = BookManager;

