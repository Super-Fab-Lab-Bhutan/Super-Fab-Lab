const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/auth");
const { imageUpload } = require("../middleware/file-upload");

const {
  getEducation,
  getResearch,
  getTraining,
  getTitles,
} = require("../controller/programs");
const {
  getAdminEducation,
  getAdminResearch,
  getAdminTraining,
  postProgram,
  newProgram,
  editProgram,
  patchProgram,
  deleteProgram,
  getAdminProgram,
} = require("../controller/adminProgram");

/** Client Side API **/

router.get("/education-program", getEducation);

router.get("/training-program", getTraining);

router.get("/research-program", getResearch);

router.get("/titles", getTitles);

/** Admin Side API **/

router.get("/admin/program", adminAuth, getAdminProgram);

router.get("/admin/education", adminAuth, getAdminEducation);

router.get("/admin/research", adminAuth, getAdminResearch);

router.get("/admin/training", adminAuth, getAdminTraining);

router.post(
  "/admin/addProgram",
  adminAuth,
  imageUpload.single("image"),
  postProgram
);

router.get("/admin/program/new", adminAuth, newProgram);

router.get("/admin/program/:id/edit", adminAuth, editProgram);

router.patch(
  "/admin/addProgram/:id",
  adminAuth,
  imageUpload.single("image"),
  patchProgram
);

router.delete("/admin/program/:id", adminAuth, deleteProgram);

module.exports = router;
