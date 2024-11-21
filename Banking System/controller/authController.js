const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, pin, initialDeposit = 0 } = req.body;

  try {
    const pinHash = bcrypt.hashSync(pin, 10);
    const accountNumber = `BANK-${Math.floor(
      1000000 + Math.random() * 9000000
    )}`;
    const user = new User({
      username,
      pinHash,
      accountNumber,
      balance: initialDeposit,
    });

    await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully", accountNumber });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, pin } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the account is locked
    if (user.isLocked && user.lockUntil > Date.now()) {
      return res
        .status(403)
        .json({
          message: `Account locked. Try again after ${new Date(
            user.lockUntil
          ).toLocaleString()}`,
        });
    }

    // If account is locked, but lockUntil time has passed, unlock it
    if (user.isLocked && user.lockUntil <= Date.now()) {
      await user.resetFailedLoginAttempts(); // Reset attempts after lock time
    }

    // Compare the entered PIN with the stored hash
    const isPinValid = await user.comparePin(pin);
    if (!isPinValid) {
      await user.incrementFailedLoginAttempts();
      return res
        .status(401)
        .json({
          message: `Invalid PIN. You have ${
            3 - user.failedLoginAttempts
          } attempts left.`,
        });
    }

    // Reset failed attempts after successful login
    await user.resetFailedLoginAttempts();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "muz", // Ensure a valid secret key
      { expiresIn: "1h" }
    );

    // Send user details in response
    return res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      accountNumber: user.accountNumber,
      balance: user.balance,
      transactionHistory: user.transactions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



