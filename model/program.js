const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    type: {
      type: String,
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
const Program = mongoose.model("program", ProgramSchema);

module.exports = Program;
