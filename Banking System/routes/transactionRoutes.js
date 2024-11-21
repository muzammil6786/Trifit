const express = require("express");
const {
  deposit,
  withdraw,
  transfer,
  getAccountStatement,
} = require("../controller/transactionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();





// Deposit
/**
 * @swagger
 * /api/deposit:
 *   post:
 *     summary: Deposit money into the user's account
 *     description: Deposits an amount into the user's account after verifying the PIN.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Deposit successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deposit of 1000 successful"
 *                 balance:
 *                   type: number
 *                   example: 5000
 *       400:
 *         description: Bad request (e.g., missing amount or pin)
 *       401:
 *         description: Unauthorized (Invalid token or PIN)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error (check logs for more details)
 */

router.post("/deposit", authMiddleware, deposit);

// Withdraw
/**
 * @swagger
 * /api/withdraw:
 *   post:
 *     summary: Withdraw money from the user's account
 *     description: Withdraws an amount from the user's account after verifying the PIN and JWT token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Withdrawn 500. New balance is 500"
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "Withdrawal"
 *                     amount:
 *                       type: number
 *                       example: 500
 *                     balanceAfterTransaction:
 *                       type: number
 *                       example: 500
 *       400:
 *         description: Invalid PIN or Insufficient balance
 *       500:
 *         description: Internal server error
 */

router.post("/withdraw", authMiddleware, withdraw);

// Transfer
/**
 * @swagger
 * /api/transfer:
 *   post:
 *     summary: Transfer money to another user
 *     description: Transfers an amount to a recipient's account after verifying the PIN and JWT token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientAccount:
 *                 type: string
 *                 example: "BANK-1234567"
 *               amount:
 *                 type: number
 *                 example: 500
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transferred 500 to BANK-1234567. New balance: 500"
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "Transfer"
 *                     amount:
 *                       type: number
 *                       example: 500
 *                     senderAccount:
 *                       type: string
 *                       example: "BANK-9876543"
 *                     recipientAccount:
 *                       type: string
 *                       example: "BANK-1234567"
 *                     balanceAfterTransaction:
 *                       type: number
 *                       example: 500
 *       400:
 *         description: Invalid PIN, Insufficient balance or Recipient not found
 *       500:
 *         description: Internal server error
 */

router.post("/transfer", authMiddleware, transfer);

// Get Account Statement
/**
 * @swagger
 * /api/accountstatement:
 *   get:
 *     summary: Get the account statement (transaction history) for the authenticated user
 *     description: Retrieves all transactions for the authenticated user, sorted by the most recent.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "Deposit"
 *                       amount:
 *                         type: number
 *                         example: 1000
 *                       balanceAfterTransaction:
 *                         type: number
 *                         example: 1000
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-11-21T10:00:00Z"
 *       404:
 *         description: No transactions found
 *       500:
 *         description: Failed to fetch account statement
 */

router.get("/accountstatement", authMiddleware, getAccountStatement);

module.exports = router;
 