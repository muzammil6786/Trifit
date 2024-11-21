const express = require("express");
const {
  deposit,
  withdraw,
  transfer,
  getAccountStatement,
} = require("../controller/transactionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/deposit", authMiddleware, deposit);
router.post("/withdraw", authMiddleware, withdraw);
router.post("/transfer", authMiddleware, transfer);
router.get("/accountstatement", authMiddleware, getAccountStatement);

module.exports = router;
