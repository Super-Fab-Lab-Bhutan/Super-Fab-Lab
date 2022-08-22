const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/auth");
const { imageUpload } = require("../middleware/file-upload");

const {
  getCarpentry,
  getElectronic,
  getHeavy,
  getLaser,
} = require("../controller/equipments");

const {
  getEquipment,
  getAdminEquipments,

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

router.get("/machines/laser", getLaser);

/** Admin Side API **/
router.get("/admin/equipment", adminAuth, getEquipment);

router.get("/admin/equipments", adminAuth, getAdminEquipments);

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
