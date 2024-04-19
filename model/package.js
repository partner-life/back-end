const database = require("../config/db");

class Package {
  static collection() {
    return database.collection("Packages");
  }
  static async findAllPackages(page, limit, search, sortByPrice, category) {
    console.log("🚀 ~ Package ~ findAllPackages ~ sortByPrice:", sortByPrice);
    const aggregations = [];

    if (search) {
      const regex = new RegExp(search, "i");
      aggregations.push({ $match: { name: { $regex: regex } } });
    }

    if (category) {
      aggregations.push({ $match: { category: category } });
    }

    aggregations.push({ $skip: (page - 1) * limit });
    aggregations.push({ $limit: limit });
    aggregations.push({ $sort: { price: +sortByPrice } });
    console.log("🚀 ~ Package ~ findAllPackages ~ aggregations:", aggregations);

    return this.collection().aggregate(aggregations).toArray();
  }
  static async findPackageById(packageId) {
    return this.collection().findOne({ _id: packageId });
  }
  static async createPackage(packageData) {
    return this.collection().insertOne(packageData);
  }
  static async deletePackage(packageId) {
    return this.collection().deleteOne({ _id: packageId });
  }
  static async editPackage(packageId, updatedData) {
    return this.collection().updateOne({ _id: packageId }, { $set: updatedData });
  }
}

module.exports = Package;
