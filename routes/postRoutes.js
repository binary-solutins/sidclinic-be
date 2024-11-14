const express = require('express');
const router = express.Router();
const { createPost,getPosts, updatePost, deletePost } = require('../controllers/postcontroller');


router.post('/', createPost);
router.get('/', getPosts);
router.put('/', updatePost);
router.delete('/:post_id', deletePost);


module.exports = router;
