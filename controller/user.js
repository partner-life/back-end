const database = require("../config/db");
const User = require("../model/user");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

class UserController {
  static async Register(req, res, next) {
    try {
      const { name, username, email, password } = req.body;
      if (name.length === 0)
        throw { name: "BadRequest", message: "name is required" };
      if (email.length === 0)
        throw { name: "BadRequest", message: "email is required" };
      if (username.length === 0)
        throw { name: "BadRequest", message: "username is required" };
      if (password.length === 0)
        throw { name: "BadRequest", message: "password is required" };
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
  static async GoogleLogin(req, res, next) {
    try {
      const { tokenGoogle } = req.body;
      const clientId =
        "369116205353-v736tacvnuvpic22d3divttnim03oiod.apps.googleusercontent.com";

      if (tokenGoogle.length === 0)
        throw { name: "BadRequest", message: "token google is required" };
      const ticket = await client.verifyIdToken({
        idToken: tokenGoogle,
        audience: clientId,
      });
      const { name, email } = ticket.getPayload();

      const result = await User.FindOrCreate(name, email);

      res.status(201).json({ access_token: result });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = UserController;
