const Program = require("../model/program");

exports.getEducation = async (req, res) => {
  try {
    const program = await Program.find({ type: "Education" });
    res.json({ program });
  } catch (e) {
    console.log(e);
  }
};
exports.getTraining = async (req, res) => {
  try {
    const program = await Program.find({ type: "Training" });
    res.json({ program });
  } catch (e) {
    console.log(e);
  }
};

exports.getResearch = async (req, res) => {
  try {
    const program = await Program.find({ type: "Research" });
    res.json({ program });
  } catch (e) {
    console.log(e);
  }
};

exports.getTitles = async (req, res) => {
  try {
    const program = await Program.find().sort({ timeCreated: -1 }).limit(4);

    res.json({ program });
  } catch (e) {
    console.log(e);
  }
};


