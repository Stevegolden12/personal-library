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

      book.find({ _id: /./ }, '_id title commentCount', function (err, books) {

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
      book.deleteMany({ _id: /./ }, function (err) {
        if (!err) {
          res.send("complete delete successful")
        } else {
          res.send("Did not delete all")
        }
      });
    });


  
  app.route('/api/books/check/:id')
    .get(function (req, res) {
      var bookEntryID = req.query.getIdForBook;
      var bookId = req.params.id;
      if (bookId === ':id') {
        bookId = bookEntryID;
      }

    
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      book.find({
        _id: bookId,
      },
        'title _id comments',
        function (err, books) {
          if (books !== undefined && books.length !== 0) {
            res.send(books)
          } else {
            res.send("No searches returned")
            //res.send("There are no matching searches")
          }

        })
    })
    
    .post(function (req, res) {
      var bookid = req.params.id;
      var bookEntryid = req.body.postIdForComment;
      var comment = req.body.updateComment;
  
      if (bookid === ':id') {
        bookid = bookEntryid;
      }
      //json res format same as .get
  
      book.findById(bookid, '_id commentCount', { new: true }, function (err, books) {
    
        if (books) {  
          book.findOneAndUpdate(
            { _id: books._id },
            {
              $push: {              
                comments: comment,            
              },   
            },
            { new: true },
            (err, books1) => {
              if (err) {

              } else {
                res.send("Successfully updated.")
              }

            });

          
          book.findOneAndUpdate(
            { _id: books._id },
            {
              $set: {
                commentCount: books.commentCount + 1,
              },
            },
            { new: true },
            (err, books1) => {           

            });

        } else {
          res.send("Could not update id " + req.body.update_id)
        }  
      })
    })
    .delete(function (req, res) {
      var bookid = req.params.id;
      var bookRemoveID = req.body.IdForRemoveBook;      
      if (bookid === ':id') {       
        bookid = bookRemoveID;
      }
      
      book.findById(bookid, { new: true }, function (err, books) {    
        if (books !== null) {
          book.findByIdAndDelete({ _id: bookid }, function (err) {
            res.send("delete successful")
          })
        } else {
          res.send("no book exists")
        }
      })

      //if successful response will be 'delete successful'
    })
 
};
