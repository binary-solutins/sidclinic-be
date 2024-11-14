const express = require('express');
const router = express.Router();
const { likePost, unlikePost, getPostLikes } = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:post_id',  likePost);
router.post('/unlike/:post_id', unlikePost);
router.get('/getalllikes/:post_id', authMiddleware, getPostLikes);
module.exports = router;