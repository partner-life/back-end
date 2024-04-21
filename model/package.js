const database = require("../config/db");

class Package {
  static collection() {
    return database.collection("Packages");
  }
  static async findAllPackages(aggregations) {
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
  static async editPackageImage(packageId, imageData) {
    return this.collection().updateOne({ _id: packageId }, { $set: { image: imageData } });
  }
}

module.exports = Package;
