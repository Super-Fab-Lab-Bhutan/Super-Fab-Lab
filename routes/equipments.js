const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/auth");
const { imageUpload } = require("../middleware/file-upload");

const {
  getCarpentry,
  getElectronic,
  getHeavy,
  getMetal,
} = require("../controller/equipments");

const {
  getEquipment,
  getAdminElectronic,
  getAdminCarpentry,
  getAdminMetal,
  getAdminHeavy,
  postEquipment,
  newEquipment,
  editEquipment,
  equipmentDelete,
  patchEquipment,
} = require("../controller/adminEquipment");

/** Client Side API **/

router.get("/machines/carpentry", getCarpentry);

router.get("/machines/electronic", getElectronic);

router.get("/machines/heavy-machinary", getHeavy);

router.get("/machines/metal-works", getMetal);

/** Admin Side API **/

router.get("/admin/equipment", getEquipment);

router.get("/admin/equipment/carpentry", getAdminCarpentry);

router.get("/admin/equipment/electronic", getAdminElectronic);

router.get("/admin/equipment/metal", getAdminMetal);

router.get("/admin/equipment/heavy", getAdminHeavy);

router.get("/admin/equipment/new", newEquipment);

router.get("/admin/equipment/:id/edit", editEquipment);

router.post("/admin/addEquipments", imageUpload.single("image"), postEquipment);

router.patch(
  "/admin/equipment/:id",
  imageUpload.single("image"),
  patchEquipment
);

router.delete("/admin/equipment/:id", equipmentDelete);

module.exports = router;
