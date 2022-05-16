const fs = require("fs");

const fileUpload = require("../model/fileUpload");

exports.getFileUploads = async (req, res) => {
  try {
    const file = await fileUpload.find({});
    res.render("./adminpanel/fileUpload/show", { file });
  } catch (e) {
    console.log(e);
  }
};

exports.addFile = async (req, res) => {
  try {
    var newNews = 0;
    if (req.file == null) {
      newNews = {
        ...req.body,
      };
    } else {
      newNews = {
        ...req.body,
        FileUrl: req.file.path,
      };
    }
    await fileUpload.create(newNews);
    res.redirect("/admin/fileupload");
  } catch (e) {
    console.log(e);
  }
};

exports.newFile = (req, res) => {
  res.render("./adminpanel/fileUpload/new");
};

exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file_path = await fileUpload.findById(id);
    await fileUpload.findByIdAndDelete(id);

    if (file_path.FileUrl != null) {
      fs.unlink(file_path.FileUrl, (err) => {
        var a = err;
      });
    }

    res.redirect("/admin/fileupload");
  } catch (e) {
    req.flash("error", "oops,something went wrong");
    res.redirect("/error");
  }
};
