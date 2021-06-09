const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const postCtrl = require('../controllers/posts')

//post routes
router.get('/', auth, postCtrl.getAllPosts)
router.post('/', auth, postCtrl.uploadPost)
router.get('/singlepost/:postId', auth, postCtrl.getSinglePost)
router.delete('/deletepost/:postId', auth, postCtrl.deletePost)

//comment routes
router.get('/comments/:postId', auth, postCtrl.getCommentsPost)
router.post('/comment/:postId', auth, postCtrl.commentPost)
router.get('/getlastcomment', auth, postCtrl.getLastComment)
router.get('/comments/:postId/:replyParentId', auth, postCtrl.getReply)
router.put('/editcomment', auth, postCtrl.editComment)
router.delete('/deletecomment/:commentId', auth, postCtrl.deleteComment)

module.exports = router