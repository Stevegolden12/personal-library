/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const shortid = require('shortid');
const multer = require('multer');
const upload = multer();
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

mongoose.connect('mongodb://localhost:27017/BookLibrary', { useNewUrlParser: true }, (err) => {
  if (!err) {
    console.log("Database connection successful")
  } else {
    console.log("Database is not connected: " + err)
  }
})

var bookSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  title: String,
  comments: [String],
  commentCount: Number
})

var book = mongoose.model('books', bookSchema);

module.exports = function (app) {

  app.route('/api/books/check/')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      console.log("Get route")
      book.find({ _id: /./ }, '_id title commentCount', function (err, books) {
        console.log("Get route callback function")
        console.log("Books: " + books)
        if (books !== undefined && books.length !== 0) {
          res.send(books)
        } else {
          res.send("No searches returned")
          //res.send("There are no matching searches")
        }          
      })
    })

    .post(function (req, res) {
      const title = req.body.createTitle;
      const createComment = req.body.createComment;
          //response will contain new book object including atleast _id and title
      console.log("Post route")
        var newBook = new book({
          _id: shortid.generate(),
          title: title,
          comments: createComment,
          commentCount: 1
        })

        newBook.save(newBook, function (err, book) {
          if (err) {
            res.send("Book could not be created")
          }
          else {
            res.send("Book successfully created. <br> Book id number is: " + book._id)
          }
        })
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });


  
  app.route('/api/books/check/:id')
    .get(function (req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function (req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
 
};
