const { ObjectId } = require("mongodb");
const Cart = require("../model/cart");

class CartController {
  static async addCart(req, res, next) {
    const { productId } = req.body;
    const userId = req.user._id;

    try {
      const newCart = await Cart.addToCart(userId, productId);
      console.log("New Cart:", newCart);
      res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async getAllCart(req, res, next) {
    const userId = req.user._id;

    try {
      const carts = await Cart.findAllCart(userId);
      console.log("Carts:", carts);
      res.status(200).json(carts);
    } catch (error) {
      next(error);
    }
  }

  static async getCartById(req, res, next) {
    const cartId = req.params.cartId;

    try {
      const cart = await Cart.findCartById(cartId); 
      console.log("Cart:", cart);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCart(req, res, next) {
    const cartId = req.params.cartId;

    try {
      const result = await Cart.deleteproductcart(cartId);
      if (result.success) {
        res.status(200).json({ message: "Cart deleted successfully" });
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateCart(req, res, next) {
    const cartId = req.params.cartId;
    const { productId, quantity } = req.body;

    try {
      const result = await Cart.editproductcart(cartId, productId, quantity);
      if (result.success) {
        res.status(200).json({ message: "Cart updated successfully" });
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
