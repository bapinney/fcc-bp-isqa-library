/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
 
    var bookIdPreviouslyAdded;
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .type('form')
        .send({
          'title': 'Testing book title'
        })
        .end(function (err, res) {
          assert.isNull(err);
          assert.equal(res.status,200);
          assert.isNotNull(res.body._id);
          bookIdPreviouslyAdded = res.body._id;
          done(); 
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .type('form')
        .send({
          'title': ""
        })
        .end(function (err, res) {
           assert.isNotNull(err);
           assert.equal(res.status,500);
           done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai.request(server)
          .get('/api/books/1bdb2277ec6308653b5a63c2')
          .end(function(err, res) {
            console.log("res.status is " + res.status);
            assert.equal(res.status, 500);
            done();
          });
      }); 
      
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
          .get('/api/books/' + bookIdPreviouslyAdded)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + bookIdPreviouslyAdded)
          .send({comment: "Testing comment"})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            chai.request(server)
            .get('/api/books/' + bookIdPreviouslyAdded)
            .end(function(err, res) {
              assert.isNull(err, 'There was no error');
              assert.equal(res.body.comments[0], "Testing comment", "Added comment displayed");
              done();
            });
        });
      });
      
    });

  });

});
