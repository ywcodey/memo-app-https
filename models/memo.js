const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["home", "work", "friend", "personal"],
  },
});

const Memo = mongoose.model("Memo", memoSchema);

module.exports = Memo;
