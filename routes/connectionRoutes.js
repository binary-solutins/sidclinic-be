const express = require('express');
const router = express.Router();
const { createConnection, getPendingConnection, acceptConnection, rejectConnection, removeConnection } = require('../controllers/connectionController');

/**
 * @swagger
 * /connections:
 *   post:
 *     summary: Create a new connection
 *     description: Create a connection request between two users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *               connected_user_id:
 *                 type: number
 *             required:
 *               - user_id
 *               - connected_user_id
 *     responses:
 *       201:
 *         description: Connection request sent
 *       400:
 *         description: User ID and connected user ID are required
 *       500:
 *         description: Error creating connection
 */
router.post('/', createConnection);

/**
 * @swagger
 * /connections/pending:
 *   get:
 *     summary: Get pending connections
 *     description: Retrieve all pending connection requests for a user
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved pending connections
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Error retrieving connections
 */
router.get('/pending', getPendingConnection);

/**
 * @swagger
 * /connections/accept:
 *   put:
 *     summary: Accept a connection request
 *     description: Accept a pending connection request between two users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *               connected_user_id:
 *                 type: number
 *             required:
 *               - user_id
 *               - connected_user_id
 *     responses:
 *       200:
 *         description: Connection request accepted
 *       400:
 *         description: User ID and connected user ID are required
 *       404:
 *         description: No pending connection request found
 *       500:
 *         description: Error accepting connection
 */
router.put('/accept', acceptConnection);

/**
 * @swagger
 * /connections/reject:
 *   put:
 *     summary: Reject a connection request
 *     description: Reject a pending connection request between two users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *               connected_user_id:
 *                 type: number
 *             required:
 *               - user_id
 *               - connected_user_id
 *     responses:
 *       200:
 *         description: Connection request rejected
 *       400:
 *         description: User ID and connected user ID are required
 *       404:
 *         description: No pending connection request found
 *       500:
 *         description: Error rejecting connection
 */
router.put('/reject', rejectConnection);

/**
 * @swagger
 * /connections/remove:
 *   delete:
 *     summary: Remove a connection
 *     description: Remove an existing connection between two users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               connection_id:
 *                 type: number
 *             required:
 *               - connection_id
 *     responses:
 *       200:
 *         description: Connection removed successfully
 *       404:
 *         description: Connection not found
 *       500:
 *         description: Error in removing connection
 */
router.delete('/remove', removeConnection);

module.exports = router;
