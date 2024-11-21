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

UserSchema.methods.comparePin = function (pin) {
  return bcrypt.compareSync(pin, this.pinHash);
};

module.exports = mongoose.model("User", UserSchema);
