const express = require("express");
const UserController = require("../controller/user");
const cartController = require("../controller/cart");
const PackageController = require("../controller/package");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Wedding Organizer" });
});

router.get("/register", UserController.Register);
router.get("/login", UserController.Login);

// API PACKAGE

router.get("/package", PackageController.getAllPackages);
router.get("/package/:packageId", PackageController.getPackageById);
router.post("/createpackage", PackageController.createPackage);
router.delete("/deletepackage/:packageId", PackageController.deletePackage);
router.put("/editpackage/:packageId", PackageController.editPackage);

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
router.patch("/add-images", upload.array("images", 10), PackageController.addImages);

// API CART

router.post("/addtocart", cartController.addToCart);

module.exports = router;
