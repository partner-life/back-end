const express = require("express");
const UserController = require("../controller/user");
const router = express.Router();

router.get("/register", UserController.Register);
router.get("/login", UserController.Login);

module.exports = router;
