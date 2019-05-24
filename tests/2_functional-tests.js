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

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
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

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .get('/api/books/')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body.createComment.length, 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body.createTitle, 'title', 'Books in array should contain title');
            //assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .get('/api/books/')
          .end(function (err, res) {
            assert.equal(res.status, 200); assert.isArray(res.body, 'response should be an array');
            assert.property(res.body.createComment.length, 'commentcount', 'Books in array should contain commentcount');
            //assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books/check/')
          .end(function (err, res, books) {
            assert.equal(res.status, 200);
            assert.isObject(books, 'response should be an object');
            assert.property(books[0][3], 'commentCount', 'Books in array should contain commentCount');
            assert.property(books[0][2], 'title', 'Books in array should contain title');
            assert.property(books[0][0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {
      //*****GET this and test below finished
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/:id')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.query, 'response should be an object');
            assert.property(res.query.getIdForBook, 'getIdForBook', 'res.query in objects should contain getIdForBook');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get('/api/books/:id')
          .end(function (err, res, books) {
            assert.equal(res.status, 200);
            assert.isArray(books, 'response should be an array');
            assert.property(books._id, '_id', 'books in objects should contain _id');
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        test('#example Test GET /api/books', function (done) {
          chai.request(server)
            .get('/api/books/check/:id')
            .end(function (err, res, req, books) {
              assert.equal(res.status, 200);
              assert.isObject(books, 'books response should be an Object');
              assert.property(req.body.updateComment, 'updateComment', 'Should be a comment');
              assert.property(books._id, '_id', 'Books object should contain _id');
              assert.property(books.comments, 'comments', 'Books object should contain comments');
              done();
            });
        });
      });

    });

  });

});
