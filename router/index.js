const express = require("express");
const UserController = require("../controller/user");
const cartController = require("../controller/cart");
const router = express.Router();

router.get("/register", UserController.Register);
router.get("/login", UserController.Login);

// API CART

router.post("/addtocart", cartController.addToCart);

module.exports = router;
