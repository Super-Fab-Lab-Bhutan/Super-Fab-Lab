const fs = require("fs");


const Equipment = require("../model/equipment");

exports.getEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.find({});
    res.render("./adminpanel/equipment/show", { equipment });
  } catch (e) {
    console.log(e);
  }
};

exports.getAdminEquipments = async (req, res, next) => {
  try {
    const equipment = await Equipment.find({});
    res.json(equipment) 
  } catch (e) {
    console.log(e);
  }
};


exports.postEquipment = async (req, res) => {
  var image = null;
  if (req.file) {
    image = req.file.path;
    
  }
  try {
    const newEquipment = {
      ...req.body,
      image: image,
    };
    await Equipment.create(newEquipment);
    res.redirect("/admin/equipment");
  } catch (e) {
    console.log(e);
  }
};

exports.newEquipment = (req, res) => {
  res.render("./adminpanel/equipment/new");
};

exports.editEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findById(id);
    res.render("./adminpanel/equipment/edit", { equipment });
  } catch (e) {
    res.redirect("/error");
  }
};

exports.patchEquipment = async (req, res) => {
  var { image } = req.body;

  if (req.file) {
    fs.unlink(image, (err) => {
      if (err == null) {
        image = req.file.path;
      }
    });
    image = req.file.path;
  }
  try {
    const updatedEquipment = { ...req.body, image: image };
    const { id } = req.params;

    await Equipment.findByIdAndUpdate(id, updatedEquipment);

    res.redirect("/admin/equipment");
  } catch (e) {
    res.redirect(e);
  }
};

exports.equipmentDelete = async (req, res) => {
  try {
    
    const { id } = req.params;
    const img_path = await Equipment.findById(id);

    if (img_path.image != null) {
      fs.unlink(img_path.image, async (err) => {
        if (err == null) {
          await Equipment.findByIdAndDelete(id);
        }
      });
      await Equipment.findByIdAndDelete(id);
    } else {
      await Equipment.findByIdAndDelete(id);
    }

    res.redirect("/admin/equipment");
  } catch (e) {
    res.redirect(e);
  }
};
