const Equipment = require("../model/equipment");

exports.getCarpentry = async (req, res, next) => {
  try {
    const equipment = await Equipment.find({
      type: "Carpentry",
      isAvailable: true,
    });
    if (!equipment) {
      res.json({ message: "No Eqipument" });
    } else {
      res.json({ equipment });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.getElectronic = async (req, res, next) => {
  try {
    const equipment = await Equipment.find({
      type: "Electronic",
      isAvailable: true,
    });
    if (!equipment) {
      res.json({ message: "No Eqipument" });
    } else {
      res.json({ equipment });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.getMetal = async (req, res, next) => {
  try {
    const equipment = await Equipment.find({
      type: "Metal",
      isAvailable: true,
    });
    if (!equipment) {
      res.json({ message: "No Eqipument" });
    } else {
      res.json({ equipment });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.getHeavy = async (req, res, next) => {
  try {
    const equipment = await Equipment.find({
      type: "Heavy",
      isAvailable: true,
    });
    if (!equipment) {
      res.json({ message: "No Eqipument" });
    } else {
      res.json({ equipment });
    }
  } catch (e) {
    console.log(e);
  }
};
