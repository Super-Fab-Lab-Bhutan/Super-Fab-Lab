const fs = require("fs");

const Team = require("../model/team");
const Gallery = require("../model/gallery");

exports.getTeam = async (req, res) => {
  try {
    const team = await Team.find({});
    res.json({ team });
  } catch (e) {
    console.log(e);
  }
};

exports.getAdminTeam = async (req, res, next) => {
  try {
    const Teams = await Team.find({});
    res.render("./adminpanel/team/show", { Teams });
  } catch (e) {
    console.log(e);
  }
};

exports.newTeam = (req, res) => {
  res.render("./adminpanel/team/new");
};

exports.teamDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const img_path = await Team.findById(id);

    if (img_path.image != null) {
      fs.unlink(img_path.image, async (err) => {
        if (err == null) {
          await Team.findByIdAndDelete(id);
        }
      });
    } else {
      await Team.findByIdAndDelete(id);
    }

    res.redirect("/admin/team");
  } catch (e) {
    res.redirect(e);
  }
};

exports.postTeam = async (req, res) => {
  var image = null;
  if (req.file) {
    image = req.file.path;
  }
  try {
    const newTeam = {
      ...req.body,
      image: image,
    };
    await Team.create(newTeam);
    res.redirect("/admin/team");
  } catch (e) {
    console.log(e);
  }
};

exports.getImages = async (req, res) => {
  try {
    const gallery = await Gallery.find({});
    res.json({ gallery });
  } catch (e) {
    console.log(e);
  }
};

exports.getAdmingallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.find({});
    res.render("./adminpanel/gallery/show", { gallery });
  } catch (e) {
    console.log(e);
  }
};


exports.galleryDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const img_path = await Gallery.findById(id);

      fs.unlink(img_path.image, async (err) => {
        if (err == null) {
          await Gallery.findByIdAndDelete(id);
        }
      });


    res.redirect("/admin/gallery");
  } catch (e) {
    res.redirect(e);
  }
};

exports.postgallery = async (req, res) => {
  if (req.file) {
    try {
      const newgallery = {
        image: req.file.path,
      };
      await Gallery.create(newgallery);
      res.redirect("/admin/gallery");
    } catch (e) {
      console.log(e);
    }
  }
  else(
    res.json({"message":"please add an image"})
  )
  
};
