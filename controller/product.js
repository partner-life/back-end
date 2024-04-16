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

  static async createProduct(req, res, next) {
    const { name, imageUrl, description, category } = req.body;
    try {
      const newProduct = await Product.createProduct({ name, imageUrl, description, category });
      console.log("🚀 ~ ProductController ~ createProduct ~ newProduct:", newProduct);
      res.status(201).json({ name, imageUrl, description, category });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    const productId = req.params.productId;
    try {
      await Product.deleteProduct(productId);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
