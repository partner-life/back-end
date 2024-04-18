const express = require("express");
const UserController = require("../controller/user");
const PacketController = require("../controller/packet");
const router = express.Router();
const authentication = require("../middleware/authentication");
const PaymentController = require("../controller/payment");
const OrdersController = require("../controller/orders");
const multer = require("multer");

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.post("/google-login", UserController.GoogleLogin);

router.get("/packet", PacketController.getAllPackets);
router.get("/packet/:packetId", PacketController.getPacketById);
router.post("/createpacket", PacketController.createPacket);
router.delete("/deletepacket/:packetId", PacketController.deletePacket);
router.put("/editpacket/:packetId", PacketController.editPacket);

const upload = multer({ storage: multer.memoryStorage() });
router.patch("/add-images", upload.array("images", 10), PacketController.addImages);

// API PAYMENT GATEWAY

router.post("/create-transaction", PaymentController.createTransaction);
router.post("/nodemailer", authentication, OrdersController.nodemailer);

//API ORDERS
router.post("/addOrders", authentication, OrdersController.createOrders);

module.exports = router;
