const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/auth");
const { imageUpload } = require("../middleware/file-upload");
const {
  getTeam,
  getAdminTeam,
  newTeam,
  teamDelete,
  postTeam,
} = require("../controller/aboutus");

router.get("/team", adminAuth, getTeam);

router.get("/admin/team", adminAuth, getAdminTeam);

router.get("/admin/team/new", adminAuth, newTeam);

router.post("/admin/addTeam", adminAuth, imageUpload.single("image"), postTeam);

router.delete("/admin/team/:id", adminAuth, teamDelete);

module.exports = router;
