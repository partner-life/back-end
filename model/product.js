const { ObjectId } = require("mongodb");
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
    try {
      const id = new ObjectId(productId);

      const result = await this.collection().findOne({
        _id: id,
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  }
  static async createProduct(productData) {
    return this.collection().insertOne(productData);
  }
  static async deleteProduct(productId) {
    return this.collection().deleteOne({ _id: productId });
  }
  static async editProduct(productId, updatedData) {
    return this.collection().updateOne(
      { _id: productId },
      { $set: updatedData }
    );
  }
  static async searchProduct(query) {
    return this.collection()
      .aggregate([
        { $match: query },
        { $project: { _id: 1, name: 1, category: 1 } },
      ])
      .toArray();
  }
}

module.exports = Product;
