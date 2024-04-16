const database = require("../config/db");

class Product {
  static collection() {
    return database.collection("Products");
  }
  static async findAllProduct() {
    return this.collection().find({}).toArray();
  }
  static async createProduct(productData) {
    return this.collection().insertOne(productData);
  }
  static async deleteProduct(productId) {
    return this.collection().deleteOne({ _id: productId });
  }
}

module.exports = Product;
