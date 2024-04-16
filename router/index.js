const express = require("express");
const UserController = require("../controller/user");
const cartController = require("../controller/cart");
const ProductController = require("../controller/product");
const router = express.Router();

router.get("/register", UserController.Register);
router.get("/login", UserController.Login);

// API PRODUCT

router.get("/product", ProductController.getAllProducts);
router.post("/createproduct", ProductController.createProduct);
router.delete("/deleteproduct/:productId", ProductController.deleteProduct);

// API CART

router.post("/addtocart", cartController.addToCart);

module.exports = router;
