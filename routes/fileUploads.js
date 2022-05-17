const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/auth");
const { fileUpload } = require("../middleware/file-upload");
const {
  getFileUploads,
  addFile,
  deleteFile,
  newFile,
} = require("../controller/fileUploads");

router.get("/admin/fileUpload", adminAuth, getFileUploads);

router.get("/admin/fileupload/new", adminAuth, newFile);

router.post("/addFile", adminAuth, fileUpload.single("file"), addFile);

router.delete("/admin/fileupload/:id", adminAuth, deleteFile);

module.exports = router;
