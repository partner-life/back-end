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
      try {
         const cartCollection = await this.collection();
         const carts = await cartCollection.find({}).toArray();
         return carts;
      } catch (error) {
         throw new Error(error.message);
      }
   }

   static async findCartById(cartId) {
  try {
    const id = new ObjectId(cartId);
    const cartCollection = await this.collection();
    const cart = await cartCollection.findOne({ _id: id });
    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
}

   static async deleteproductcart(cartId) {
      return this.collection().deleteOne({ _id: cartId });
   }
   static async editproductcart(cartId, updatedData) {
      return this.collection().updateOne({ _id: cartId }, { $set: updatedData });
   }
}

module.exports = cart;
