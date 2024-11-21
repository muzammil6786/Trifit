const mongoose = require("mongoose");
const connection = mongoose.connect(
  "mongodb+srv://muzammil:khan@cluster0.nwe9ct0.mongodb.net/bank_system?retryWrites=true&w=majority"
);

module.exports = {
    connection
}