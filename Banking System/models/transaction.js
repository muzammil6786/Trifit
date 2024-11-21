const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Deposit", "Withdrawal", "Transfer"],
    required: true,
  },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  balanceAfterTransaction: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
});


const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
