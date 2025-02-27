const express = require("express");
const UserController = require("../controller/user");
const PackageController = require("../controller/package");
const router = express.Router();
const authentication = require("../middleware/authentication");
const multer = require("multer");
const PaymentController = require("../controller/payment");
const OrdersController = require("../controller/orders");
const authorization = require("../middleware/authorization");

router.get("/", (req, res) => {
  res.json({ message: "Wedding Organizer" });
});

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.post("/google-login", UserController.GoogleLogin);
router.get("/showAllUser", UserController.showAllUser);
router.get("/showMuchUser", UserController.showMuchUser);

router.get("/package", PackageController.getAllPackages);
router.get("/package/:packageId", PackageController.getPackageById);
router.post("/createpackage", authentication, PackageController.createPackage);
router.delete("/deletepackage/:packageId", authentication, PackageController.deletePackage);
router.put("/editpackage/:packageId", authentication, PackageController.editPackage);

const upload = multer({ storage: multer.memoryStorage() });
router.patch("/add-images", upload.array("images", 10), PackageController.addImages);

router.post("/create-transaction/:orderId", authentication, PaymentController.createTransaction);
router.post("/handling-after-payment", PaymentController.handleNotification);
router.post("/nodemailer", authentication, OrdersController.nodemailer);
router.post("/paidNodemailer", authentication, PaymentController.paidNodemailer);

router.post("/addOrders/:packetId", authentication, OrdersController.createOrders);
router.put("/updateOrders/:orderId", authentication, authorization, OrdersController.editOrders);

router.get("/totalPrice", OrdersController.showTotalPrice);
router.get("/allOrders", OrdersController.showAllOrders);

router.get("/historyOrder", authentication, OrdersController.showOrderById);

module.exports = router;
