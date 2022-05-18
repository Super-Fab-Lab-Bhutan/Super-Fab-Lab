const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/auth");
const { galleryUpload ,imageUpload} = require("../middleware/file-upload");
const {
  getTeam,
  getAdminTeam,
  newTeam,
  teamDelete,
  postTeam,
  getImages,
  getAdmingallery,
  postgallery,
  galleryDelete,
} = require("../controller/aboutus");

router.get("/team", getTeam);

router.get("/getimages", getImages);

router.get("/admin/gallery", adminAuth, getAdmingallery);

router.post(
  "/admin/addgallery",
  adminAuth,
  galleryUpload.single("image"),
  postgallery
);

router.delete("/admin/gallery/:id", adminAuth, galleryDelete);

router.get("/admin/team", adminAuth, getAdminTeam);

router.get("/admin/team/new", adminAuth, newTeam);

router.post("/admin/addTeam", adminAuth, imageUpload.single("image"), postTeam);

router.delete("/admin/team/:id", adminAuth, teamDelete);

module.exports = router;
