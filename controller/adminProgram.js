const fs = require("fs");

const Program = require("../model/program");

exports.getAdminProgram = async (req, res) => {
  try {
    const program = await Program.find({});
    res.render("./adminpanel/program/show", { program, all: true });
  } catch (e) {
    console.log(e);
  }
};

exports.getAdminEducation = async (req, res) => {
  try {
    const program = await Program.find({ type: "Education" });
    res.render("./adminpanel/program/show", { program, all: false });
  } catch (e) {
    console.log(e);
  }
};

exports.getAdminResearch = async (req, res) => {
  try {
    const program = await Program.find({ type: "Research" });
    res.render("./adminpanel/program/show", { program, all: false });
  } catch (e) {
    console.log(e);
  }
};

exports.getAdminTraining = async (req, res) => {
  try {
    const program = await Program.find({ type: "Training" });

    res.render("./adminpanel/program/show", { program, all: false });
  } catch (e) {
    console.log(e);
  }
};

exports.postProgram = async (req, res) => {
  var image = null;
  if (req.file) {
    image = req.file.path;
  }
  try {
    const newProgram = {
      ...req.body,
      image: image,
    };
    await Program.create(newProgram);
    res.redirect("/admin/program");
  } catch (e) {
    console.log(e);
  }
};

exports.newProgram = (req, res) => {
  res.render("./adminpanel/program/new");
};

exports.editProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findById(id);

    res.render("./adminpanel/program/edit", { program });
  } catch (e) {
    res.redirect("/error");
  }
};

exports.patchProgram = async (req, res) => {
  var {image} = req.body;
  if (req.file) {
    fs.unlink(image, (err) => {
      if (err == null) {
        image = req.file.path;
      }
    });
    image = req.file.path;
  }
  try {
    const updatednews = { ...req.body, image: image };
    const { id } = req.params;

    await Program.findByIdAndUpdate(id, updatednews);

    res.redirect("/admin/program");
  } catch (e) {
    res.redirect("/error");
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const img_path = await Program.findById(id);

    if (img_path.image != null) {
      fs.unlink(img_path.image, async (err) => {
        if (err == null) {
          await Program.findByIdAndDelete(id);
        }
      });
    } else {
      await Program.findByIdAndDelete(id);
    }
    res.redirect("/admin/program");
  } catch (e) {
    res.redirect("/error");
  }
};
