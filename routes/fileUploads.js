const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/auth");
const { fileUpload } = require("../middleware/file-upload");
const {
  getMachine,
  getVideo,
  getTraining,
  getAdminMachine,
  getAdminVideo,
  getAdminTraining,
  getFileUploads,
  addFile,
  deleteFile,
  newFile,
} = require("../controller/fileUploads");

router.get("/machinemanuals", getMachine);

router.get("/trainingresources", getTraining);

router.get("/video", getVideo);


router.get("/admin/machinemanuals",adminAuth, getAdminMachine);

router.get("/admin/trainingresources",adminAuth, getAdminTraining);

router.get("/admin/video",adminAuth, getAdminVideo);

router.get("/admin/fileUpload", adminAuth, getFileUploads);

router.get("/admin/fileupload/new", adminAuth, newFile);

router.post("/addFile", adminAuth, fileUpload.single("file"), addFile);

router.delete("/admin/fileupload/:id", adminAuth, deleteFile);

module.exports = router;
