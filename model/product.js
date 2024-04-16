const database = require("../config/db");

class Product {
  static collection() {
    return database.collection("Products");
  }
  static async findAllProduct() {
    return this.collection().find({}).toArray();
  }
  static async findProductById(productId) {
    return this.collection().findOne({ _id: productId });
  }
  static async createProduct(productData) {
    return this.collection().insertOne(productData);
  }
  static async deleteProduct(productId) {
    return this.collection().deleteOne({ _id: productId });
  }
  static async editProduct(productId, updatedData) {
    return this.collection().updateOne({ _id: productId }, { $set: updatedData });
  }
}

module.exports = Product;
