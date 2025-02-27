const { ObjectId } = require("mongodb");
const database = require("../config/db");

class Orders {
  static async newOrders(
    userId,
    packetId,
    address,
    phoneNumber,
    husbandName,
    wifeName,
    dateOfMerried
  ) {
    const id = new ObjectId(packetId);
    const packet = await database.collection("Packages").findOne({ _id: id });
    const newOrders = database.collection("Orders").insertOne({
      UserId: userId,
      PackageId: id,
      status: "Belum Bayar",
      price: packet.price,
      Profile: {
        husbandName: husbandName,
        wifeName: wifeName,
        address: address,
        phoneNumber: phoneNumber,
        dateOfMerried: dateOfMerried,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const result = database
      .collection("Orders")
      .findOne((await newOrders).insertedId);
    return result;
  }
  static async ordersById(orderId) {
    const id = new ObjectId(orderId);
    return await database.collection("Orders").findOne({ _id: id });
  }
  static async allOrders() {
    return await database.collection("Orders").find({}).toArray();
  }
  static async updateOrders(
    orderId,
    address,
    phoneNumber,
    husbandName,
    wifeName,
    dateOfMerried
  ) {
    const id = new ObjectId(orderId);

    const order = await database.collection("Orders").updateOne(
      { _id: id },
      {
        $set: {
          "Profile.address": address,
          "Profile.phoneNumber": phoneNumber,
          "Profile.husbandName": husbandName,
          "Profile.wifeName": wifeName,
          "Profile.dateOfMarried": dateOfMerried,
        },
      }
    );
    const findone = await this.findOrderById(orderId);
    return findone;
  }
  static async findOrderById(orderId) {
    const id = new ObjectId(orderId);
    return await database
      .collection("Orders")
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "UserId",
            foreignField: "_id",
            as: "User",
          },
        },
        {
          $lookup: {
            from: "Packages",
            localField: "PackageId",
            foreignField: "_id",
            as: "Package",
          },
        },
      ])
      .toArray();
  }
  static async getTotalPrice() {
    const allOrders = await database
      .collection("Orders")
      .find({ status: "Sudah Dibayar" })
      .toArray();

    const result = allOrders.reduce((total, order) => {
      return total + parseInt(order.price);
    }, 0);

    const formattedResult = result.toLocaleString("id-ID", { currency: "IDR" });

    return formattedResult;
  }
  static async finOrders() {
    return await database
      .collection("Orders")
      .aggregate([
        {
          $lookup: {
            from: "Users",
            localField: "UserId",
            foreignField: "_id",
            as: "User",
          },
        },
        {
          $lookup: {
            from: "Packages",
            localField: "PackageId",
            foreignField: "_id",
            as: "Package",
          },
        },
      ])
      .toArray();
  }
  static async findOrderByUser(userId) {
    return await database
      .collection("Orders")
      .aggregate([
        {
          $match: {
            UserId: userId,
          },
        },
        {
          $lookup: {
            from: "Users",
            localField: "UserId",
            foreignField: "_id",
            as: "User",
          },
        },
        {
          $lookup: {
            from: "Packages",
            localField: "PackageId",
            foreignField: "_id",
            as: "Package",
          },
        },
      ])
      .toArray();
  }
}
module.exports = Orders;
