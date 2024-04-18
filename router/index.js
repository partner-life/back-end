const express = require("express");
const UserController = require("../controller/user");
const cartController = require("../controller/cart");
const PacketController = require("../controller/packet");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Wedding Organizer" });
});

router.get("/register", UserController.Register);
router.get("/login", UserController.Login);

// API PACKET

router.get("/packet", PacketController.getAllPackets);
router.get("/packet/:packetId", PacketController.getPacketById);
router.post("/createpacket", PacketController.createPacket);
router.delete("/deletepacket/:packetId", PacketController.deletePacket);
router.put("/editpacket/:packetId", PacketController.editPacket);

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
router.patch("/add-images", upload.array("images", 10), PacketController.addImages);

// API CART

router.post("/addtocart", cartController.addToCart);

module.exports = router;
