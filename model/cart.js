const database = require("../config/db");

class cart {
   static async addToCart(userId, productId, quantity) {
      const db = await database.collection("Carts");
      try {
         const existingProduct = await db.findOne({ userId: userId, "products.productId": productId });

         if (existingProduct) {
            await db.updateOne({ userId: userId, "products.productId": productId }, { $inc: { "products.$.quantity": quantity } });
         } else {
            await db.updateOne({ userId: userId }, { $push: { products: { productId: productId, quantity: quantity } } }, { upsert: true });
         }
         return { success: true, message: "Product added to cart successfully" };
      } catch (error) {
         console.error("Error adding product to cart:", error);
         return { success: false, message: "Error adding product to cart" };
      }
   }
}

module.exports = cart;
