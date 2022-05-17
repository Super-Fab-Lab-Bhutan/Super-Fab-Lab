const express = require("express");
const router = express.Router();

const { adminAuth,Auth } = require("../middleware/auth");
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

router.get("/admin/users", adminAuth, getUsers);

router.get("/viewusers/:id/edit", adminAuth, editUsers);

router.get("/viewusers/approval", adminAuth, getApproval);

router.patch("/viewusers/:id", adminAuth, patchUsers);

router.patch("/viewusers/:id/approve", adminAuth, patchApprove);

router.delete("/viewusers/:id", adminAuth, deleteUser);

module.exports = router;
