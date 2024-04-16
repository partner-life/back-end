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
         _id:result.insertedId,
         ...addcart,
      }
   }
}

module.exports = cart;
