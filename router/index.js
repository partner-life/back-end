const express = require("express");
const UserController = require("../controller/user");
const cartController = require("../controller/cart");
const ProductController = require("../controller/product");
const router = express.Router();

router.get("/register", UserController.Register);
router.get("/login", UserController.Login);

// API PRODUCT

router.get("/product", ProductController.getAllProducts);

// API CART

router.post("/addtocart", cartController.addCart);
router.get("/getcart/:userId", cartController.getCart);
router.delete("/deleteproductcart/:productId", cartController.deleteCart);

module.exports = router;
