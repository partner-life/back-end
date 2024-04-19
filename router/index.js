const express = require("express");
const UserController = require("../controller/user");
const PackageController = require("../controller/package");
const router = express.Router();
const authentication = require("../middleware/authentication");
const multer = require("multer");
const PaymentController = require("../controller/payment");
const OrdersController = require("../controller/orders");

router.get("/", (req, res) => {
  res.json({ message: "Wedding Organizer" });
});

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.post("/google-login", UserController.GoogleLogin);

router.get("/package", PackageController.getAllPackages);
router.get("/package/:packageId", PackageController.getPackageById);
router.post("/createpackage", PackageController.createPackage);
router.delete("/deletepackage/:packageId", PackageController.deletePackage);
router.put("/editpackage/:packageId", PackageController.editPackage);

const upload = multer({ storage: multer.memoryStorage() });
router.patch("/add-images", upload.array("images", 10), PackageController.addImages);

router.post("/create-transaction", PaymentController.createTransaction);
router.post("/handling-after-payment", PaymentController.handleNotification);
router.post("/nodemailer", authentication, OrdersController.nodemailer);

router.post("/addOrders", authentication, OrdersController.createOrders);

module.exports = router;
