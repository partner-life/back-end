const database = require("../config/db");

class cart {
   static collection() {
      return database.collection("Carts");
   }
   static async addTocart({ userId, productId, quantity }) {
      const cartCollection = this.collection();

      const addcart = {
         userId: userId,
         productId: productId,
         quantity,
         createdAt: new Date(),
         updatedAt: new Date(),
      };
      const result = await cartCollection.insertOne(addcart);
      return {
         _id: result.insertedId,
         ...addcart,
      };
   }
   static async getCart(userId) {
      const cartCollection = this.collection();
      const result = await cartCollection.findOne({ userId: userId });
      return result;
   }
   static async deleteproductcart(cartId) {
      try {
          const cartCollection = this.collection()
          const result = await cartCollection.deleteOne({ _id: cartId });
          if (result.deletedCount === 1) {
              return { success: true, message: "Cart deleted successfully" };
          } else {
              return { success: false, message: "Cart not found" };
          }
      } catch (error) {
          console.error("Error deleting cart:", error);
          return { success: false, message: "Error deleting cart" };
      }
  }
}

module.exports = cart;
