const Cart = require("../model/cart");

class CartController {
   static async addToCart(req, res, next) {
      try {
         const { productId, quantity } = req.body;
         const cart = await Cart.addToCart(productId, quantity);
         res.status(200).json(cart);
      } catch (error) {
         next(error);
      }
   }
}
module.exports = CartController;
