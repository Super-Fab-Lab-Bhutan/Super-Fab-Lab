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

router.get("/admin/equipment", adminAuth, getEquipment);

router.get("/admin/equipment/carpentry", adminAuth, getAdminCarpentry);

router.get("/admin/equipment/electronic", adminAuth, getAdminElectronic);

router.get("/admin/equipment/metal", adminAuth, getAdminMetal);

router.get("/admin/equipment/heavy", adminAuth, getAdminHeavy);

router.get("/admin/equipment/new", adminAuth, newEquipment);

router.get("/admin/equipment/:id/edit", adminAuth, editEquipment);

router.post(
  "/admin/addEquipments",
  adminAuth,
  imageUpload.single("image"),
  postEquipment
);

router.patch(
  "/admin/equipment/:id",
  adminAuth,
  imageUpload.single("image"),
  patchEquipment
);

router.delete("/admin/equipment/:id", adminAuth, equipmentDelete);

module.exports = router;
