const { ObjectId } = require("mongodb");
const database = require("../config/db");

class payment {
  static collection() {
    return database.collection("Orders");
  }
  static updateOrderStatus(orderId, newStatus) {
    return this.collection().updateOne({ _id: new ObjectId(orderId) }, { $set: { status: newStatus } });
  }
}
module.exports = payment;
