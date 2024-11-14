const db = require('../config/db'); // Your DB connection
require('dotenv').config();
// Create a new post
exports.createPost = async (req, res) => {
    const { user_id, content } = req.body;
    const query = 'INSERT INTO Posts (user_id, content) VALUES (?, ?)';
    try {
        await db.query(query, [user_id, content]);
        res.status(201).json({ message: 'Post created successfully' });
    } catch (err) {
       
        res.status(500).json({ message: 'Error creating post', error: err });
        console.error(err);
    }
};

// Get all posts
exports.getPosts = async (req, res) => {
    const query = 'SELECT * FROM Posts';
    try {
        const posts = await db.query(query);
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching posts', error: err });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    const { post_id, content } = req.body;
    const query = 'UPDATE Posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE post_id = ?';
    try {
        const [result] = await db.query(query, [content, post_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating post', error: err });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    const post_id = req.params.post_id; 
    const query = 'DELETE FROM Posts WHERE post_id = ?';
    try {
        const result = await db.query(query, [post_id]); // Remove destructuring
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting post', error: err });
    }
};
