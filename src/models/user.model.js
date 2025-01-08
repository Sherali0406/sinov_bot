const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userID: { type: String },
  full_name: { type: String },
  phone: { type: String },
  telegram: {},
  hasCompletedTest: Boolean,
});

module.exports = mongoose.model("User", userSchema);
