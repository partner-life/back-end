const { compare } = require("bcryptjs");
const database = require("../config/db");
const hash = require("../helper/bcrypt");
const { signToken } = require("../helper/jwt");
const { ObjectId } = require("mongodb");

class User {
  static async register({ name, username, email, password }) {
    const db = database.collection("Users");

    const dataUser = await this.findAll();
    const usernameExists = await dataUser.some(
      (user) => user.username === username
    );
    if (usernameExists)
      throw { name: "BadRequest", message: "username has been used" };
    const emailExist = await dataUser.some((user) => user.email === email);
    if (emailExist)
      throw { name: "BadRequest", message: "email has been used" };
    if (name.length === 0)
      throw { name: "BadRequest", message: "name is required" };
    if (email.length === 0)
      throw { name: "BadRequest", message: "email is required" };
    if (username.length === 0)
      throw { name: "BadRequest", message: "username is required" };
    if (password.length === 0)
      throw { name: "BadRequest", message: "password is required" };
    const pass = hash(password);
    const newUser = await db.insertOne({
      name,
      username,
      email,
      password: pass,
      role: "user",
    });
    const result = await db.findOne(newUser.insertedId);
    return result;
  }
  static async findAll() {
    const user = database.collection("Users").find({}).toArray();
    return user;
  }
  static async Login(email, password) {
    const result = await database.collection("Users").findOne({ email });
    if (!result)
      throw { name: "unauthorized", message: "email/password is wrong" };
    const validPassword = await compare(password, result.password);

    if (!validPassword)
      throw { name: "unauthorized", message: "email/password is wrong" };
    const access_token = signToken({
      id: result._id,
      email: result.email,
    });

    return access_token;
  }
  static async FindOrCreate(name, email) {
    let user = await database.collection("Users").findOne({ email: email });

    if (!user) {
      const result = await database.collection("Users").insertOne({
        username: name,
        name: name,
        email: email,
        password: Math.random().toString(),
        role: "User",
      });

      user = await database
        .collection("Users")
        .findOne({ _id: result.insertedId });
    }

    const access_token = signToken({
      id: user._id,
      email: user.email,
    });

    return access_token;
  }
  static async FindByPk(id) {
    const newId = new ObjectId(id);
    // console.log(newId);
    const user = await database.collection("Users").findOne({ _id: newId });
    // console.log(user);
    return user;
  }
}
module.exports = User;
