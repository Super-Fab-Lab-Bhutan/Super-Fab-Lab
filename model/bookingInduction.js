const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: false,
    },
    UserName: {
      type: String,
    },
    UserEmail: {
      type: String,
    },
    UserPhone: {
      type: String,
    },
    UserOrganization: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    times: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("bookingInduction", bookingSchema);
