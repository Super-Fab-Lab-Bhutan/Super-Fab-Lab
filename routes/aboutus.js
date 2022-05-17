const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/auth");
const { imageUpload } = require("../middleware/file-upload");
const {getTeam,getAdminTeam,newTeam,teamDelete,postTeam}=require("../controller/aboutus");

router.get("/team",getTeam);

router.get("/admin/team",getAdminTeam);

router.get("/admin/team/new",newTeam);

router.post(
    "/admin/addTeam",
    imageUpload.single("image"),
    postTeam
  );

router.delete("/admin/team/:id", teamDelete);


module.exports = router;
