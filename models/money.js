const mongoose = require("mongoose");
const moneySchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true,
  },
});

const Money = mongoose.model("Money", moneySchema);

const transactionSchema = new mongoose.Schema({
  reason: {
    type: String,
    require: true,
  },
  money: {
    type: Number,
    require: true,
  },
  type: {
    type: String,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = { Money, Transaction };
