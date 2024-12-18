const User = require("../models/user");
const Transaction = require("../models/transaction");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Deposit
exports.deposit = async (req, res) => {
  const { amount, pin } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  try {
    // Get user from request (assuming user is authenticated)
    const user = req.user; // This should be set by your authentication middleware

    // Check if user is locked
    if (user.isLocked) {
      return res.status(403).json({ message: "Account is locked." });
    }

    // Ensure pin is a string before comparing
    const pinString = String(pin); // Force the pin to be a string

    // Compare the PIN using the comparePin method
    const isPinValid = await user.comparePin(pinString);

    if (!isPinValid) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    // Perform deposit
    user.balance += amount;
    await user.save(); // Save updated balance

    // Create a transaction record with the `user` field properly set
    const transaction = new Transaction({
      type: "Deposit",
      amount,
      balanceAfterTransaction: user.balance,
      user: user._id, // Set the `user` field to the user's _id
    });

    // Save transaction and update user
    await transaction.save();
    user.transactions.push(transaction);
    await user.save();

    // Return success response
    return res.status(200).json({
      message: `Deposited ${amount}. New balance is ${user.balance}`,
      transaction,
    });
  } catch (error) {
    console.error("Error during deposit:", error); // Log any errors that occur
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Withdraw
exports.withdraw = async (req, res) => {
  const { amount, pin } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  try {
    const user = req.user; 

    // Check if user is locked
    if (user.isLocked) {
      return res.status(403).json({ message: "Account is locked." });
    }

    
    const pinString = String(pin); // Force the pin to be a string

    // Compare the PIN using the comparePin method
    const isPinValid = await user.comparePin(pinString);

    if (!isPinValid) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    // Check if balance is sufficient for the withdrawal
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Perform withdrawal
    user.balance -= amount;
    await user.save(); // Save updated balance

    // Create a transaction record with the `user` field properly set
    const transaction = new Transaction({
      type: "Withdrawal",
      amount,
      balanceAfterTransaction: user.balance,
      user: user._id, // Set the `user` field to the user's _id
    });

    // Save transaction and update user
    await transaction.save();
    user.transactions.push(transaction);
    await user.save();

    // Return success response
    return res.status(200).json({
      message: `Withdrawn ${amount}. New balance is ${user.balance}`,
      transaction,
    });
  } catch (error) {
    console.error("Error during withdrawal:", error); // Log any errors that occur
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Transfer
// In your transfer function
exports.transfer = async (req, res) => {
  const { recipientAccount, amount, pin } = req.body;
  const token = req.header("Authorization").split(" ")[1];

  // Step 1: Validate amount
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Amount must be greater than 0" });
  }

  try {
    // Step 2: Verify the token and decode it to get the sender's ID
    const decoded = jwt.verify(token, "muz");
    const sender = await User.findOne({ _id: decoded.id });
    const recipient = await User.findOne({ accountNumber: recipientAccount });

    // Step 3: Check if sender exists and pin is provided
    if (!sender) {
      return res.status(400).json({ message: "Sender not found" });
    }

    if (!pin) {
      return res.status(400).json({ message: "PIN is required" });
    }

    // Step 4: Check if the pin is valid using bcrypt
    if (!bcrypt.compareSync(pin, sender.pinHash)) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    // Step 5: Check if the recipient exists
    if (!recipient) {
      return res.status(400).json({ message: "Recipient not found" });
    }

    // Step 6: Check if sender is sending money to their own account
    if (sender.accountNumber === recipient.accountNumber) {
      return res
        .status(400)
        .json({ message: "You cannot transfer money to your own account" });
    }

    // Step 7: Check if recipient's account is locked (blocked)
    if (recipient.isLocked) {
      const lockTime = Date.now() + 30 * 60 * 1000; // Add 30 minutes
      const readableTime = new Date(lockTime).toLocaleString();
      return res.status(400).json({
        message: `Recipient's account is locked please try again ${readableTime} `,
      });
    }

    // Step 9: Deduct amount from sender's balance and add to recipient's balance
    const fee = amount * 0.02; // 2% fee calculation
    const transferAmount = amount - fee; // The amount that will actually be transferred after fee

    // Deduct the transfer amount (after fee) from sender's balance
    sender.balance -= transferAmount;
    // Add the full amount to the recipient's balance
    recipient.balance += amount;

    // Step 10: Create transaction record with fee field
    const transaction = new Transaction({
      type: "Transfer",
      amount, // Full amount (before fee)
      fee, // The calculated fee
      senderAccount: sender.accountNumber,
      recipientAccount: recipient.accountNumber,
      balanceAfterTransaction: sender.balance,
      timestamp: new Date(),
      user: sender._id, // Include the sender as the user field
    });

    // Step 11: Save the transaction document
    const savedTransaction = await transaction.save();

    // Step 12: Add the transaction to both sender and recipient's transaction history
    sender.transactions.push(savedTransaction._id);
    recipient.transactions.push(savedTransaction._id);

    // Step 13: Save updated sender and recipient
    await sender.save();
    await recipient.save();

    // Step 14: Send success response with transaction details
    res.status(200).json({
      message: `Transferred ${amount} to ${recipientAccount}. Transaction fee: ₹${fee.toFixed(
        2
      )}. New balance: ₹${sender.balance}`,
      transaction: savedTransaction,
    });
  } catch (error) {
    console.error("Error during transfer:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



// get Transfer History
exports.getAccountStatement = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, "muz");
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch detailed data for each transaction ID
    const transactions = await Promise.all(
      user.transactions.slice(-10).map(async (transactionId) => {
        const transaction = await Transaction.findById(transactionId); // Assuming 'Transaction' is your model
        if (!transaction) {
          return null; // If transaction not found, return null
        }

        // Format the timestamp as a full date and time
        const timestamp = new Date(transaction.timestamp);
        const formattedDateTime =
          timestamp instanceof Date && !isNaN(timestamp)
            ? timestamp.toLocaleString() // This will include both date and time
            : "Invalid Date";

        return {
          timestamp: formattedDateTime,
          amount: transaction.amount || 0,
          type: transaction.type || "Unknown",
        };
      })
    );

    // Remove null transactions (those that couldn't be found)
    const validTransactions = transactions.filter(
      (transaction) => transaction !== null
    );

    res.json({
      transactions: validTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





exports.getBalance = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, "muz");
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      balance: user.balance,
      accountNumber: user.accountNumber,
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};