/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var BookManager = require('../controllers/BookManager.js');
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {

  app.route('/api/books')
    .get(function (req, res){
      var bm = new BookManager(db);
      bm.listBooks().then(data => {
        console.log("Listbooks returned data");
        res.json(data);
      }, error => {
        res.status(500).json({error: "no book exists"});
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if (title.length === 0) {
        res.status(500).send("Book title missing");
        return false;
      }
      var bm = new BookManager(db);
      bm.addBook(title).then(data => {
        //res.json([{"_id": "sampleID1111", "title": "Sample Book!", "commentcount":42}]);
        res.json(data);
      }, error => {
        res.status(500).json({error: "Try again later"});  
      });      
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      var bm = new BookManager(db);
      bm.deleteAll().then(result => {
        if (result) {
          res.send("complete delete successful");
          return true;
        }}, error => {
          res.status(500).send("Unable to delete all books. " + error);
          return false;
        });
        
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      var bm = new BookManager(db);
      bm.getBook(bookid).then(data => {
        if (data) {
          res.json(data);
        }
        else {
          res.status(500).send("Unable to fetch or find book");
        }
      }, error => {
        res.status(500).send("Unable to fetch or find book");
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //console.dir(req);
      var bm = new BookManager(db);
      bm.addComment(bookid, comment).then(data => {
        console.log("Comment response");
        res.json(data);
      }, error => {
        res.status(500).json({error: "Unable to add comment.  Please try again later"});
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      var bm = new BookManager(db);
      console.log("Delete called");
      bm.deleteBook(bookid).then(data => {
        res.send("delete successful");
      }, error => {
        res.status(500).json({error: "Unable to delete book. Please try again later."});
      });
      
    });
  
};
