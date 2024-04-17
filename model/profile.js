const { ObjectId } = require("mongodb");
const database = require("../config/db");

class Profle {
  static collection() {
    return database.collection("Profile");
  }
  static async findAll() {
    const profile = (await this.collection()).find({}).toArray();
    return profile;
  }
  static async findById(id) {
    const _id = new ObjectId(id);
    return (await this.collection()).findOne({ _id: _id });
  }
  static async createProfile(userId, phoneNumber, address) {
    const id = new ObjectId(userId);
    const result = this.collection().insertOne({
      UserId: id,
      phoneNumber: phoneNumber,
      address: address,
    });
    const findOne = await this.collection().findOne((await result).insertedId);
    return findOne;
  }
}
module.exports = Profle;
