const Cart = require("../model/cart");

class CartController {
   static async addCart(req, res, next) {
      try {
         const { userId, productId, quantity } = req.body; 
         const cart = await Cart.addTocart({ userId, productId, quantity }); 
         res.status(200).json(cart);
      } catch (error) {
         next(error);
      }
   }
}

module.exports = CartController;
