const { ObjectId } = require("mongodb");
const Packet = require("../model/packet");

class PacketController {
  static async getAllPackets(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || Number.MAX_SAFE_INTEGER;
    const search = req.query.search || "";
    const sortByPrice = req.query.sortByPrice || 1;
    const category = req.query.category || "";

    try {
      const packets = await Packet.findAllPackets(page, limit, search, sortByPrice, category);
      console.log("🚀 ~ PacketController ~ getAllPackets ~ packets:", packets);
      res.status(200).json({ page, limit, packets });
    } catch (error) {
      next(error);
    }
  }

  static async getPacketById(req, res, next) {
    const packetId = req.params.packetId;
    try {
      if (!packetId) {
        throw { name: "BadRequest", message: "Packet ID is required" };
      }
      const packet = await Packet.findPacketById(new ObjectId(packetId));
      if (!packet) {
        throw { name: "NotFound", message: "Packet not found" };
      }
      res.status(200).json(packet);
    } catch (error) {
      next(error);
    }
  }

  static async createPacket(req, res, next) {
    const { name, imageUrl, description, category, price } = req.body;
    try {
      if (!name || !description || !category || !price) {
        throw { name: "BadRequest", message: "Name, description, category, and price cannot be empty" };
      }
      const newPacket = await Packet.createPacket({ name, imageUrl, description, category, price });
      console.log("🚀 ~ PacketController ~ createPacket ~ newPacket:", newPacket);
      res.status(201).json({ name, imageUrl, description, category, price });
    } catch (error) {
      next(error);
    }
  }

  static async deletePacket(req, res, next) {
    const packetId = req.params.packetId;
    try {
      if (!packetId) {
        throw { name: "BadRequest", message: "Packet ID is required" };
      }
      const packet = await Packet.findPacketById(new ObjectId(packetId));
      if (!packet) {
        throw { name: "BadRequest", message: "Packet not found" };
      }
      await Packet.deletePacket(new ObjectId(packetId));
      res.status(200).json({ message: "Packet deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async editPacket(req, res, next) {
    const packetId = req.params.packetId;
    const updatedData = req.body;
    try {
      if (!packetId) {
        throw { name: "BadRequest", message: "Packet ID is required" };
      }
      const packet = await Packet.findPacketById(new ObjectId(packetId));
      if (!packet) {
        throw { name: "BadRequest", message: "Packet not found" };
      }

      await Packet.editPacket(new ObjectId(packetId), updatedData);
      res.status(200).json({ message: "Packet updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async addImages(req, res, next) {
    console.log("🚀 ~ PacketController ~ addImages ~ console:");

    try {
      const cloudinary = require("cloudinary").v2;

      cloudinary.config({
        cloud_name: process.env.CLOUND_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });

      const uploadPromises = req.files.map(async (file) => {
        const mimeType = file.mimetype;
        const data = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${mimeType};base64,${data}`;
        return cloudinary.uploader.upload(dataURI, {
          overwrite: false,
          unique_filename: true,
        });
      });
      console.log("🚀 ~ PacketController ~ uploadPromises ~ uploadPromises:", uploadPromises);

      const results = await Promise.all(uploadPromises);

      const images = results.map((element) => {
        return { imgUrl: element.url };
      });

      console.log("🚀 ~ PacketController ~ images ~ images:", images);
      res.json(images);
      return images;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = PacketController;
