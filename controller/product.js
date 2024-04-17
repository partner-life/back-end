const { ObjectId } = require("mongodb");
const Product = require("../model/product");

class ProductController {
  static async getAllProducts(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || Number.MAX_SAFE_INTEGER;
    const search = req.query.search || "";

    try {
      const products = await Product.findAllProducts(page, limit, search);
      console.log("🚀 ~ ProductController ~ getAllProducts ~ products:", products);
      res.status(200).json({ page, limit, products });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    const productId = req.params.productId;
    try {
      if (!productId) {
        throw { name: "BadRequest", message: "Product ID is required" };
      }
      const product = await Product.findProductById(new ObjectId(productId));
      if (!product) {
        throw { name: "NotFound", message: "Product not found" };
      }
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    const { name, imageUrl, description, category } = req.body;
    try {
      if (!name || !description || !category) {
        throw { name: "BadRequest", message: "Name, description, and category cannot be empty" };
      }
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
      if (!productId) {
        throw { name: "BadRequest", message: "Product ID is required" };
      }
      const product = await Product.findProductById(new ObjectId(productId));
      if (!product) {
        throw { name: "BadRequest", message: "Product not found" };
      }
      await Product.deleteProduct(new ObjectId(productId));
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async editProduct(req, res, next) {
    const productId = req.params.productId;
    const updatedData = req.body;
    try {
      if (!productId) {
        throw { name: "BadRequest", message: "Product ID is required" };
      }
      const product = await Product.findProductById(new ObjectId(productId));
      if (!product) {
        throw { name: "BadRequest", message: "Product not found" };
      }

      await Product.editProduct(new ObjectId(productId), updatedData);
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async addImages(req, res, next) {
    console.log("🚀 ~ ProductController ~ addImages ~ console:");

    try {
      const cloudinary = require("cloudinary").v2;

      cloudinary.config({
        cloud_name: process.env.CLOUND_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });

      const uploadPromises = req.files.map(async (file) => {
        const mimeType = file.mimetype;
        const data = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${mimeType};base64,${data}`;
        return cloudinary.uploader.upload(dataURI, {
          overwrite: false,
          unique_filename: true,
        });
      });
      console.log("🚀 ~ ProductController ~ uploadPromises ~ uploadPromises:", uploadPromises);

      const results = await Promise.all(uploadPromises);

      const images = results.map((element) => {
        return { imgUrl: element.url };
      });

      console.log("🚀 ~ ProductController ~ images ~ images:", images);
      res.json(images);
      return images;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = ProductController;
