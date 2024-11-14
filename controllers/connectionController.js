const db = require('../config/db');
require('dotenv').config();

exports.createConnection = async (req, res) => {
    const { user_id, connected_user_id } = req.body;

    if (!user_id || !connected_user_id) {
        return res.status(400).json({ message: 'User ID and connected user ID are required' });
    }

    try {
        // Create the connection request with 'pending' status using SQL query
        await db.query('INSERT INTO Connections (user_id, connected_user_id, status, created_at) VALUES (?, ?, ?, ?)', 
            [user_id, connected_user_id, 'pending', new Date()]);
        res.status(201).json({ message: 'Connection request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating connection', error });
    }
};

exports.getPendingConnection = async (req, res) => {
    const { user_id } = req.query; // Changed to req.query to match the route parameter
    if (!user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const [pendingConnections] = await db.query('SELECT * FROM Connections WHERE user_id = ? AND status = ?', [user_id, 'pending']); // Filter by user_id
        if (pendingConnections.length === 0) {
            return res.status(404).json({ message: 'No open pending connection requests for this user' }); // Error message if no pending connections
        }
        res.status(200).json({ message: 'All pending connections fetched', data: pendingConnections }); // Changed status code and message
    } catch (error) {
        res.status(500).json({ message: 'Error occurred', error });
    }
}

exports.acceptConnection = async (req, res) => {
    const { user_id, connected_user_id } = req.body;

    if (!user_id || !connected_user_id) {
        return res.status(400).json({ message: 'User ID and connected user ID are required' });
    }

    try {
        // Check if the connection request exists with 'pending' status
        const [results] = await db.query(
            'SELECT * FROM Connections WHERE user_id = ? AND connected_user_id = ? AND status = ?',
            [user_id,connected_user_id,  'pending']
        );
        console.log(results);

        // Check if the result is empty
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Connection request not found or already accepted/rejected' });
        }

        // The connection request exists, now update its status to 'accepted'
        await db.query(
            'UPDATE Connections SET status = ? WHERE user_id = ? AND connected_user_id = ?',
            ['accepted', user_id,connected_user_id]
        );

        res.status(200).json({ message: 'Connection request accepted' });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting connection', error });
        console.log(error);
    }
};

exports.rejectConnection = async (req, res) => {
    const { user_id, connected_user_id } = req.body;

    if (!user_id || !connected_user_id) {
        return res.status(400).json({ message: 'User ID and connected user ID are required' });
    }

    try {
        // Check if the connection request exists with 'pending' status
        const [results] = await db.query(
            'SELECT * FROM Connections WHERE user_id = ? AND connected_user_id = ? AND status = ?',
            [user_id,connected_user_id,  'pending']
        );
        console.log(results);

        // Check if the result is empty
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Connection request not found or already accepted/rejected' });
        }

        // The connection request exists, now update its status to 'accepted'
        await db.query(
            'UPDATE Connections SET status = ? WHERE user_id = ? AND connected_user_id = ?',
            ['rejected', user_id,connected_user_id]
        );

        res.status(200).json({ message: 'Connection request rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting connection', error });
        console.log(error);
    }
};

exports.removeConnection = async (req,res) => {
    const {connection_id} = req.body;

    if(!connection_id){
       return res.status(404).json({message:'Connection Id is required'})
    }

    try{
        const [results] = await db.query('SELECT * FROM Connections WHERE connection_id = ?',
            [connection_id]
        );
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Connection not found' });
        }
        await db.query('DELETE FROM Connections WHERE connection_id = ?',[connection_id]);
        res.status(200).json({message:'connection removed successfully!'})
    }catch(error){
        return res.status(500).json({message:'Error in remove connection',error});
    }
}