const express = require("express");
const { register, login, logout } = require("../controller/authController");
const router = express.Router();


/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with a username, pin, and optional initial deposit.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               pin:
 *                 type: string
 *                 example: "1234"
 *               initialDeposit:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 accountNumber:
 *                   type: string
 *                   example: BANK-1234567
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message
 */
router.post("/register", register);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login to an existing user account
 *     description: Authenticates a user based on their username and PIN, and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token and transaction history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: your-jwt-token
 *                 transactionHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       transactionId:
 *                         type: string
 *                         example: "txn123"
 *                       amount:
 *                         type: number
 *                         example: 100
 *                       date:
 *                         type: string
 *                         example: "2024-11-21T10:00:00Z"
 *       401:
 *         description: Invalid PIN
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.post("/login", login);


module.exports = router;
