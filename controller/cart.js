const { ObjectId } = require("mongodb");
const Cart = require("../model/cart");

class CartController {
  static async addCart(req, res, next) {
    const { productId } = req.body;
    const UserId = req.user._id;
    console.log(UserId);
    try {
      const newCart = await Cart.addToCart(productId, UserId);
      console.log("��� ~ CartController ~ addCart ~ newCart:", newCart);
      res.status(200).json({ message: "succes add product to carts" });
    } catch (error) {
      next(error);
    }
  }
  static async getAllCart(req, res, next) {
    const cartId = req.params.cartId;
    console.log("��� ~ CartController ~ getCart ~ cartId:", cartId);
    try {
      const cart = await Cart.findCartById(new ObjectId(cartId));
      console.log("��� ~ CartController ~ getCart ~ cart:", cart);
    } catch (error) {
      next(error);
    }
  }
  static async getCartById(req, res, next) {
    const cartId = req.params.cartId;
    console.log("��� ~ CartController ~ getCartById ~ cartId:", cartId);
    try {
      const cart = await Cart.findCartById(new ObjectId(cartId));
      console.log("��� ~ CartController ~ getCartById ~ cart:", cart);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }
  static async deleteCart(req, res, next) {
    const cartId = req.params.cartId;
    console.log("��� ~ CartController ~ deleteCart ~ cartId:", cartId);
    try {
      const cart = await Cart.deleteproductcart(cartId);
      console.log("��� ~ CartController ~ deleteCart ~ cart:", cart);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }
  static async updateCart(req, res, next) {
    const cartId = req.params.cartId;
    console.log("��� ~ CartController ~ updateCart ~ cartId:", cartId);
    try {
      const { productId, quantity } = req.body;
      const cart = await Cart.updateproductcart(cartId, productId, quantity);
      console.log("��� ~ CartController ~ updateCart ~ cart:", cart);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
