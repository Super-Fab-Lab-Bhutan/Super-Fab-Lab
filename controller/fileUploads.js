const fs = require("fs");

const fileUpload = require("../model/fileUpload");

exports.getMachine = async (req, res) => {
  try {
    const file = await fileUpload.find({ type: "Manual" });
    res.json({ file });
  } catch (e) {
    console.log(e);
  }
};

exports.getTraining = async (req, res) => {
  try {
    const file = await fileUpload.find({ type: "Resource" });
    res.json({ file });
  } catch (e) {
    console.log(e);
  }
};

exports.getVideo = async (req, res) => {
  try {
    const file = await fileUpload.find({ type: "Video" });
    res.json({ file });
  } catch (e) {
    console.log(e);
  }
};

exports.getAdminMachine = async (req, res) => {
  try {
    const file = await fileUpload.find({ type: "Manual" });
    res.render("./adminpanel/fileUpload/manual", { file, all: false });
  } catch (e) {
    console.log(e);
  }
};

exports.getAdminTraining = async (req, res) => {
  try {
    const file = await fileUpload.find({ type: "Resource" });
    res.render("./adminpanel/fileUpload/resource", { file, all: false });
  } catch (e) {
    console.log(e);
  }
};

exports.getAdminVideo = async (req, res) => {
  try {
    const file = await fileUpload.find({ type: "Video" });
    res.render("./adminpanel/fileUpload/video", { file, all: false });
  } catch (e) {
    console.log(e);
  }
};

exports.getFileUploads = async (req, res) => {
  try {
    const file = await fileUpload.find({});
    res.render("./adminpanel/fileUpload/show", { file, all: true });
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
    res.redirect("/error");
  }
};

exports.updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const fileUploads = await fileUpload.findById(id);

    var { image } = req.body;
 
    var { Uploadtype } = req.body;
    var FileUrl;

    if (Uploadtype == "File") {
      if (req.file) {
        fs.exists(fileUploads.FileUrl, function (isExist) {
          if (isExist) {
            fs.unlink(fileUploads.FileUrl, (err) => {
              if (err) {
                console.log(err);
              } else {
                FileUrl = req.file.path;
              }
            });
          }
        });
        FileUrl = req.file.path;
      }
    } else if (Uploadtype == "Link") {
      fs.exists(fileUploads.FileUrl, function (isExist) {
        if (isExist) {
          fs.unlink(fileUploads.FileUrl, (err) => {
            if (err) {
              console.log(err);
            } else {
              var { fileURL } = req.body;
              FileUrl = fileURL;
            }
          });
        }
      });
      var { fileURL } = req.body;
      FileUrl = fileURL;
    }

    const updatedFile = { ...req.body, FileUrl: FileUrl };

    await fileUpload.findByIdAndUpdate(id, updatedFile);

    res.redirect("/admin/fileupload");
  } catch (e) {
    res.json(e);
  }
};

exports.getEditFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await fileUpload.findById(id);
    res.render("./adminpanel/fileUpload/edit", { file });
  } catch (e) {
    res.redirect("/error");
  }
};
