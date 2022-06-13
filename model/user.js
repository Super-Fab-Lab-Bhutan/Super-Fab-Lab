const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim:true
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim:true
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      trim:true
    },
    organization: {
      type: String,
      minlength: 6,
      required: true,
      trim:true
    },
    gender: {
      type: String,
      trim:true
    },
    role: {
      type: String,
      required: true,
      trim:true
    },
    inductionTraning: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    timeCreated: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const User = Mongoose.model("user", UserSchema);

module.exports = User;
