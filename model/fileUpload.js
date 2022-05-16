const mongoose = require("mongoose");

const fileUpload = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    type:{
        type:String,
    },
    description: {
      type: String,
    },
    FileUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("fileUpload", fileUpload);
