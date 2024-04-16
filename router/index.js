const express = require("express");
const UserController = require("../controller/user");
const cartController = require("../controller/cart");
const ProductController = require("../controller/product");
const router = express.Router();

router.get("/register", UserController.Register);
router.get("/login", UserController.Login);

// API PRODUCT

router.get("/product", ProductController.getAllProducts);
router.get("/product/:productId", ProductController.getProductById);
router.post("/createproduct", ProductController.createProduct);
router.delete("/deleteproduct/:productId", ProductController.deleteProduct);
router.put("/editproduct/:productId", ProductController.editProduct);

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
router.patch("/add-images", upload.array("images", 10), ProductController.addImages);

// API CART

router.post("/addtocart", cartController.addToCart);

module.exports = router;
