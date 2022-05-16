const express = require("express");
const router = express.Router();
const {
  getProfile,
  getUsers,
  editUsers,
  patchApprove,
  patchUsers,
  deleteUser,
  getApproval,
} = require("../controller/users");

/** Client Side API **/

router.post("/profile", getProfile);

/** Admin Side API **/

router.get("/admin/users", getUsers);

router.get("/viewusers/:id/edit", editUsers);

router.get("/viewusers/approval", getApproval);

router.patch("/viewusers/:id", patchUsers);

router.patch("/viewusers/:id/approve", patchApprove);

router.delete("/viewusers/:id", deleteUser);

module.exports = router;
