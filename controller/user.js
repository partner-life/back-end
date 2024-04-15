const User = require("../model/user");

class UserController {
  static async Register(req, res, next) {
    try {
      const { name, username, email, password } = req.body;
      const createUser = await User.register({
        name,
        username,
        email,
        password,
      });
      res.status(201).json(createUser);
    } catch (error) {
      next(error);
    }
  }
  static async Login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: "BadRequest", message: "email is required" };
      if (!password)
        throw { name: "BadRequest", message: "password is required" };
      const result = await User.Login(email, password);
      res.status(200).json({ access_token: result });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = UserController;
