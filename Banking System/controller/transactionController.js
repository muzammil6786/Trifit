const User = require("../models/user");
const Transaction = require("../models/transaction");

// Deposit
exports.deposit = async (req, res) => {
  const { amount, pin } = req.body;

  try {
    const user = req.user;
    if (user.isLocked)
      return res.status(403).json({ message: "Account is locked." });
    if (!user.comparePin(pin))
      return res.status(401).json({ message: "Invalid PIN" });

    user.balance += amount;

    const transaction = new Transaction({
      type: "Deposit",
      amount,
      balanceAfterTransaction: user.balance,
    });

    await transaction.save();
    user.transactions.push(transaction);
    await user.save();

    res.json({ message: "Deposit successful", balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Withdraw
exports.withdraw = async (req, res) => {
  const { amount, pin } = req.body;
  const token = req.header("Authorization").split(" ")[1]; // Get JWT token from Authorization header

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "muz");
    const user = await User.findOne({ where: { _id: decoded.id } });

    if (!user || !bcrypt.compareSync(pin, user.pin)) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= amount;
    await user.save();

    const transaction = {
      type: "Withdrawal",
      amount,
      balanceAfterTransaction: user.balance,
      timestamp: new Date(),
    };
    user.transactions.push(transaction);
    await user.save();

    res.status(200).json({
      message: `Withdrawn ${amount}. New balance is ${user.balance}`,
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

};

// Transfer
exports.transfer = async (req, res) => {
  const { recipientAccount, amount, pin } = req.body;
  const token = req.header("Authorization").split(" ")[1];

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "muz");
    const sender = await User.findOne({ where: { _id: decoded.id } });
    const recipient = await User.findOne({
      where: { accountNumber: recipientAccount },
    });

    if (!sender || !bcrypt.compareSync(pin, sender.pin)) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    if (!recipient) {
      return res.status(400).json({ message: "Recipient not found" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    const transaction = {
      type: "Transfer",
      amount,
      senderAccount: sender.accountNumber,
      recipientAccount: recipient.accountNumber,
      balanceAfterTransaction: sender.balance,
      timestamp: new Date(),
    };

    sender.transactions.push(transaction);
    recipient.transactions.push(transaction);

    await sender.save();
    await recipient.save();

    res.status(200).json({
      message: `Transferred ${amount} to ${recipientAccount}. New balance: ${sender.balance}`,
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

};



exports.getAccountStatement = async (req, res) => {
  try {
    
    // Fetch all transactions for the authenticated user
    const transactions = await Transaction.find({ user : req._id })
      .sort({ timestamp: -1 }) // Sort by most recent first
      .exec();

    // If no transactions are found for this user
    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    // Return the found transactions
    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error); // Log any errors for debugging
    res
      .status(500)
      .json({
        message: "Failed to fetch account statement",
        error: error.message,
      });
  }
};
