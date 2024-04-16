const database = require("../config/db");

class cart {
   static collection() {
      return database.collection("Carts");
   }
   static async addToCart(productId) {
      const cartCollection = this.collection();
      const result = await cartCollection.insertOne({ productId });
      return result;
   }
   static async findAllCart() {
      const cart = this.collection.find({}).toArray();
      return cart;
   }
   static async findCartById(cartId) {
      const cart = this.collection.findOne({ _id: cartId });
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
