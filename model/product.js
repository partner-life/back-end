const database = require("../config/db");

class Product {
  static collection() {
    return database.collection("Products");
  }

  static async findAllProducts(page, limit, search) {
    const aggregations = [];

    if (search) {
      const regex = new RegExp(search, "i");
      aggregations.push({ $match: { name: { $regex: regex } } });
    }

    aggregations.push({ $skip: (page - 1) * limit });
    aggregations.push({ $limit: limit });

    return this.collection().aggregate(aggregations).toArray();
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
