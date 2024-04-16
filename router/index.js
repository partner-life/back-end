const express = require("express");
const UserController = require("../controller/user");
const ProductController = require("../controller/product");
const router = express.Router();

router.get("/register", UserController.Register);
router.get("/login", UserController.Login);

router.get("/product", ProductController.getAllProducts);

module.exports = router;
