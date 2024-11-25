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
 *     summary: User login
 *     description: Logs in a user by verifying their username and pin. If successful, returns a JWT token and user details.
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
 *         description: Login successful
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
 *                   example: "jwt_token_here"
 *                 username:
 *                   type: string
 *                   example: john_doe
 *                 accountNumber:
 *                   type: string
 *                   example: BANK-1234567
 *                 balance:
 *                   type: number
 *                   example: 1000.0
 *                 transactionHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-11-25"
 *                       transactionType:
 *                         type: string
 *                         example: "deposit"
 *                       amount:
 *                         type: number
 *                         example: 500.0
 *       401:
 *         description: Invalid PIN
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid PIN. You have 2 attempts left.
 *       403:
 *         description: Account locked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account locked. Try again after 2024-11-25 15:30.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post("/login", login);


module.exports = router;
