const fs = require("fs");

const Team = require("../model/team");

exports.getTeam= async(req,res)=>{
    try {
        const team = await Team.find({});
        res.json({team});
      } catch (e) {
        console.log(e);
      }
}

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