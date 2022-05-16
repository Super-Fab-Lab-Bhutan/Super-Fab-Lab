const Mongoose = require("mongoose");

const equipmentSchema = new Mongoose.Schema(
  {
    equipmentName: {
      type: String,
      required: true,
    },
    image: {
      type: String,

    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startup: {
      type: Boolean,
    },
    communtiy: {
      type: Boolean,
    },
    student: {
      type: Boolean,
    },
    company: {
      type: Boolean,
    },
    timeCreated: {
      type: Date,
      default: () => Date.now(),
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Mongoose.model("equipment", equipmentSchema);
