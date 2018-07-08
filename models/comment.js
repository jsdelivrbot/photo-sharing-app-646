var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
   id: Number,
   comment: String
})

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;