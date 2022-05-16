const express = require("express");
const router = express.Router();

const { register, login, getGateway, logout, adminLogin,getAdmin} = require("../controller/auth");

router.get("/", getGateway);

router.get("/admin", getAdmin)

router.get("/login", adminLogin);

router.get("/logout", logout);

router.route("/api/auth/register").post(register);

router.route("/api/auth/login").post(login);

module.exports = router;
