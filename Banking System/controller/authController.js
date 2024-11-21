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

    if (!user.comparePin(pin)) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "muz", // Ensure a valid secret key
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      transactionHistory: user.transactions, // Assuming transactions are populated
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};






