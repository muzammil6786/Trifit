const express = require("express");
const {
  deposit,
  withdraw,
  transfer,
  getAccountStatement,
  getBalance,
} = require("../controller/transactionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


// Deposit
router.post("/deposit", authMiddleware, deposit);
/**
 * @swagger
 * /api/deposit:
 *   post:
 *     summary: Deposit money to the account
 *     description: Deposits a specified amount to the user's account after PIN verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
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
 *                   example: "Deposited 1000. New balance is 5000"
 *       400:
 *         description: Invalid amount
 *       401:
 *         description: Invalid PIN
 *       403:
 *         description: Account locked
 *       500:
 *         description: Internal server error
 */

// Withdraw
router.post("/withdraw", authMiddleware, withdraw);

/**
 * @swagger
 * /api/withdraw:
 *   post:
 *     summary: Withdraw money from the account
 *     description: Withdraws a specified amount from the user's account after PIN verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
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
 *                   example: "Withdrawn 500. New balance is 4500"
 *       400:
 *         description: Invalid amount
 *       401:
 *         description: Invalid PIN
 *       403:
 *         description: Insufficient balance
 *       500:
 *         description: Internal server error
 */





//Transfer

router.post("/transfer", authMiddleware, transfer);
/**
 * @swagger
 * /api/transfer:
 *   post:
 *     summary: Transfer money between accounts
 *     description: Transfers a specified amount from one user's account to another user's account after PIN verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 500
 *               recipientAccount:
 *                 type: string
 *                 example: "BANK-8006210"
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
 *                   example: "Transfer successful. New balance is 4500."
 *       400:
 *         description: Invalid amount or account number
 *       401:
 *         description: Invalid PIN
 *       403:
 *         description: Insufficient balance
 *       404:
 *         description: Recipient account not found
 *       500:
 *         description: Internal server error
 */



//account transactions
router.get("/accountstatement", authMiddleware, getAccountStatement);
/**
 * @swagger
 * /api/accountStatement:
 *   get:
 *     summary: Get account statement
 *     description: Retrieves the statement of transactions for the user's account, including deposits, withdrawals, and transfers.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-11-01"
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Account statement retrieved successfully
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
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-11-01"
 *                       type:
 *                         type: string
 *                         example: "Deposit"
 *                       amount:
 *                         type: number
 *                         format: float
 *                         example: 1000
 *                       balance:
 *                         type: number
 *                         format: float
 *                         example: 5000
 *       400:
 *         description: Invalid date format
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

//account balance
router.get("/balance", authMiddleware, getBalance);
/**
 * @swagger
 * /api/balance:
 *   get:
 *     summary: Get account balance
 *     description: Fetches the current balance of the user's account.
 *     responses:
 *       200:
 *         description: Balance fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   format: float
 *                   example: 5000
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */














module.exports = router;
 