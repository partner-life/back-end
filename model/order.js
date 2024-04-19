const { ObjectId } = require("mongodb");
const database = require("../config/db");

class Orders {
   static async newOrders(userId, packetId, address, phoneNumber, nameHusband, nameWife, dateOfMerried) {
      const id = new ObjectId(packetId);
      const packet = await database.collection("Packages").findOne({ _id: id });
      const newOrders = database.collection("Orders").insertOne({
         UserId: userId,
         PacketId: packetId,
         status: "false",
         price: packet.price,
         Profile: {
            nameHusband: nameHusband,
            nameWife: nameWife,
            address: address,
            phoneNumber: phoneNumber,
            dateOfMerried: dateOfMerried,
         },
      });
      const result = database.collection("Orders").findOne((await newOrders).insertedId);
      return result;
   }
   static async ordersById(_id) {
      return await database.collection("Orders").findOne(_id);
   }
   static async allOrders() {
      return await database.collection("Orders").find({}).toArray();
   }
}
module.exports = Orders;
