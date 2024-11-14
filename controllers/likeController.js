
const db = require('../config/db');
require('dotenv').config();

exports.likePost = async (req, res) => {
    const { user_id } = req.body;
    const { post_id } = req.params;
  
    try {
      const [existLike] = await db.query(
        'select * from Likes where user_id = ? and post_id = ?',
        [user_id, post_id]
      );
      if (existLike && existLike.length > 0) {
        return res.status(400).json({ message: 'You have already liked this post' });
      }
      await db.query('insert into Likes (user_id, post_id) values (?, ?)', [
        user_id,
        post_id,
      ]);
      res.status(200).json({ message: 'Post Liked Successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error in liking the post', error: error });
      console.log(error)
    }
  };

  exports.unlikePost = async (req, res) => {
    const { user_id } = req.body;  
    const { post_id } = req.params; 

    try {
        // Remove the destructuring and directly use the result
        const result = await db.query('DELETE FROM Likes WHERE user_id = ? AND post_id = ?', [user_id, post_id]);
        
        // MySQL2 returns the affected rows in result[0].affectedRows
        if (result[0]?.affectedRows === 0) {
            return res.status(404).json({ message: 'Like does not exist for this post' });
        }
        
        res.status(200).json({ message: 'Post unliked successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error unliking post', error: err });
    }
};

exports.getPostLikes = async (req, res) => {
    const { post_id } = req.params; // Extract post_id from the route parameters

    try {
        const likes = await db.query('SELECT * FROM Likes WHERE post_id = ?', [post_id]);
        res.status(200).json(likes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching likes', error: err });
    }
};
