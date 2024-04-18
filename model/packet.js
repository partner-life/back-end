const database = require("../config/db");

class Packet {
  static collection() {
    return database.collection("Packets");
  }
  static async findAllPackets(page, limit, search) {
    const aggregations = [];

    if (search) {
      const regex = new RegExp(search, "i");
      aggregations.push({ $match: { name: { $regex: regex } } });
    }

    aggregations.push({ $skip: (page - 1) * limit });
    aggregations.push({ $limit: limit });
    console.log("🚀 ~ Packet ~ findAllPackets ~ aggregations:", aggregations);

    return this.collection().aggregate(aggregations).toArray();
  }
  static async findPacketById(packetId) {
    return this.collection().findOne({ _id: packetId });
  }
  static async createPacket(packetData) {
    return this.collection().insertOne(packetData);
  }
  static async deletePacket(packetId) {
    return this.collection().deleteOne({ _id: packetId });
  }
  static async editPacket(packetId, updatedData) {
    return this.collection().updateOne({ _id: packetId }, { $set: updatedData });
  }
}

module.exports = Packet;
