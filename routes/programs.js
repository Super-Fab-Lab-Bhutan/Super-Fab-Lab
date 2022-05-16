const express = require("express");
const router = express.Router();

const {imageUpload} = require("../middleware/file-upload")

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

router.get("/admin/program", getAdminProgram);

router.get("/admin/education", getAdminEducation);

router.get("/admin/research", getAdminResearch);

router.get("/admin/training", getAdminTraining);

router.post("/admin/addProgram", imageUpload.single('image'), postProgram);

router.get("/admin/program/new", newProgram);

router.get("/admin/program/:id/edit", editProgram);

router.patch("/admin/addProgram/:id",imageUpload.single('image'), patchProgram);

router.delete("/admin/program/:id", deleteProgram);

module.exports = router;
