const express = require("express");
const router = express.Router();
const {fileUpload} = require("../middleware/file-upload")
const {
  getFileUploads,
  addFile,
  deleteFile,
  newFile,
} = require("../controller/fileUploads");

router.get("/admin/fileUpload", getFileUploads);

router.get("/admin/fileupload/new", newFile);

router.post("/addFile",fileUpload.single('file'), addFile);

router.delete("/admin/fileupload/:id", deleteFile);

module.exports = router;
