const Product = require("../model/product");

class ProductController {
  static async getAllProducts(req, res, next) {
    try {
      const products = await Product.findAllProduct();
      console.log("🚀 ~ ProductController ~ getAllProducts ~ products:", products);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
