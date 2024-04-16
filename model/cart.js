const { ObjectId } = require("mongodb");
const database = require("../config/db");

class cart {
  static collection() {
    return database.collection("Carts");
  }
  static async addToCart(productId, UserId) {
    const id = new ObjectId(productId);
    const cartCollection = this.collection();
    const result = await cartCollection.insertOne({
      ProductId: id,
      UserId: UserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  }
  static async findAllCart() {
    const cart = this.collection.find({}).toArray();
    return cart;
  }
  static async findCartById(cartId) {
    const id = new ObjectId(cartId);
    console.log(id);
    const cart = await this.collection().findOne({ _id: id });
    console.log(cart);
    return cart;
  }
  static async deleteproductcart(cartId) {
    return this.collection().deleteOne({ _id: cartId });
  }
  static async editproductcart(cartId, updatedData) {
    return this.collection().updateOne({ _id: cartId }, { $set: updatedData });
  }
}

module.exports = cart;
