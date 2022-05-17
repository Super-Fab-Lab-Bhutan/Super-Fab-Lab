const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/auth");
const {
  register,
  login,
  getGateway,
  logout,
  adminLogin,
  getAdmin,
  get404,
} = require("../controller/auth");

router.get("/", getGateway);

router.get("/admin",adminAuth, getAdmin);

router.get("/login", adminLogin);

router.get("/logout", logout);

router.route("/api/auth/register").post(register);

router.route("/api/auth/login").post(login);

router.get("/404", get404);
module.exports = router;
