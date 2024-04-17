const express = require("express");
const UserController = require("../controller/user");
const cartController = require("../controller/cart");
const ProductController = require("../controller/product");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const router = express.Router();

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.post("/google-login", UserController.GoogleLogin);

// API PRODUCT

router.get("/product", authentication, ProductController.getAllProducts);
router.get("/product/:productId", ProductController.getProductById);
router.post("/createproduct", ProductController.createProduct);
router.delete("/deleteproduct/:productId", ProductController.deleteProduct);
router.put("/editproduct/:productId", ProductController.editProduct);

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
router.patch("/add-images", upload.array("images", 10), ProductController.addImages);

// API CART

router.post("/addtocart", authentication, cartController.addCart);
router.get("/getcart/", authentication, cartController.getAllCart);
router.get("/getcart/:cartId", authentication, authorization, cartController.getCartById);
router.delete("/deleteproductcart/:productId", authentication, authorization, cartController.deleteCart);
router.put("/editproductcart/:productId", authentication, authorization, cartController.updateCart);

module.exports = router;
