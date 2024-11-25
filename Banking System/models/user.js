const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  pinHash: { type: String, required: true },
  accountNumber: { type: String, unique: true, required: true },
  balance: { type: Number, default: 0 },
  failedLoginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  lockUntil: { type: Date },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
});

// Compare the PIN with the stored hash
UserSchema.methods.comparePin = function (pin) {
  return bcrypt.compareSync(pin, this.pinHash);
};

// Reset failed login attempts after successful login
UserSchema.methods.resetFailedLoginAttempts = function () {
  this.failedLoginAttempts = 0;
  this.isLocked = false;
  this.lockUntil = null;
  return this.save();
};

// Increment failed login attempts
UserSchema.methods.incrementFailedLoginAttempts = function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 2) {
    this.isLocked = true;
    this.lockUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
  }
  return this.save();
};

module.exports = mongoose.model("User", UserSchema);
