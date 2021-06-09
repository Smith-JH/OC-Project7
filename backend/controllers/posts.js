let db = require('../dbConfig');

exports.uploadPost = (req, res, next) => {
  let sql = 'INSERT INTO Posts (UserID, Title, Text) VALUES ("'+req.body.userId+'", "'+req.body.title+'", "'+req.body.text+'")'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '201',
      message: 'Post saved successfully!',
      data: null
    })
  })
}

exports.commentPost = (req, res, next) => {
  db.query('SET foreign_key_checks = 0; INSERT INTO Comments (UserID, Comment, PostID, ParentID, ReplyTo) VALUES ("'+req.body.userId+'", "'+req.body.comment+'", "'+req.params.postId+'", "'+req.body.parentId+'", "'+req.body.replyTo+'"); SELECT Comments.CommentID, Comments.Comment, Comments.UserID, Comments.PostID, Comments.ParentID, Users.Username FROM Comments INNER JOIN Users On Comments.UserID = Users.UserID WHERE CommentID = LAST_INSERT_ID(); SET foreign_key_checks = 1;', function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '201',
      message: 'Comment saved successfully!',
      data: result
    })
  })
}

exports.getLastComment = (req, res, next) => {
  db.query('SELECT Comments.CommentID, Comments.Comment, Comments.UserID, Comments.PostID, Comments.ParentID, Comments.ReplyTo, Users.Username FROM Comments INNER JOIN Users On Comments.UserID = Users.UserID WHERE CommentID = LAST_INSERT_ID();', function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: null,
      data: result
    })
  })
}

exports.deletePost = (req, res, next) => {
  let sqlDelete = 'DELETE FROM Posts WHERE PostID = "'+req.params.postId+'";'
  db.query(sqlDelete, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: 'Post Deleted!',
      data: null
    })
  })
}

exports.getAllPosts = (req, res, next) => {
  let sql = 'SELECT Posts.PostID, Posts.UserID, Posts.Title, Posts.Text, Posts.DateTime, Users.Username FROM Posts INNER JOIN Users ON Posts.UserID=Users.UserID;'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: null,
      data: result
    })
  })
}

exports.getSinglePost = (req, res, next) => {
  let sql = 'SELECT * FROM Posts WHERE PostID = "'+req.params.postId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: null,
      data: result
    })
  })
}

exports.getCommentsPost = (req, res, next) => {
  let sql = 'SELECT CommentID, Comment, PostID, ParentID, c.UserID, Users.Username, EXISTS(SELECT 1 FROM Comments r WHERE r.ParentID = c.CommentID) hasReply from Comments c INNER JOIN Users ON c.UserID = Users.UserID WHERE ParentID = 0 AND PostID = "'+req.params.postId+'";'
  db.query(sql, function (err, comments, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      error: err
    })
    res.json({
      status: '200',
      message: null,
      data: comments
    })
  })
}

exports.getReply = (req, res, next) => {
  let sql = 'SELECT CommentID, ReplyTo, Comment, PostID, ParentID, c.UserID, Users.Username, EXISTS(SELECT 1 FROM Comments r WHERE r.ParentID = c.CommentID) hasReply from Comments c INNER JOIN Users ON c.UserID = Users.UserID WHERE PostID = "'+req.params.postId+'" AND ParentID = "'+req.params.replyParentId+'";'
  db.query(sql, function (err, comments, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      error: err
    })
    res.json({
      status: '200',
      message: null,
      data: comments
    })
  })
}

exports.deleteComment = (req, res, next) => {
  let sql = 'DELETE FROM Comments WHERE CommentID = "'+req.params.commentId+'";'
  db.query(sql, function (err, result, fields) {
    if (err) return res.json({
      status: err.status,
      message: err.sqlMessage,
      data: err
    })
    res.json({
      status: '200',
      message: 'Comment Deleted!',
      data: null
    })
  })
}

exports.editComment = (req, res, next) => {
  let sql = 'UPDATE Comments SET Comment = "'+req.body.comment+'" WHERE CommentID = "'+req.body.commentId+'";'
    db.query(sql, function (err, result, fields) {
      if (err) return res.json({
        status: err.status,
        message: err.sqlMessage,
        data: err
      })
      res.json({
        status: '200',
        message: 'Comment Edited!',
        data: null
      })
    })
}