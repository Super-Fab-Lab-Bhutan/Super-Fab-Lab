const mongoose = require("mongoose");

const ForgotPasswordSchema = new mongoose.Schema({
  userId: String,

  uniqueString: String,

  createdAt: Date,

  expiresAt: Date,
});

module.exports = mongoose.model("PasswordReset", ForgotPasswordSchema);
