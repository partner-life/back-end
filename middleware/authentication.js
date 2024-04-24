const { verifyToken } = require("../helper/jwt");
const User = require("../model/user");

const authentication = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken)
      throw { name: "unauthorized", message: "Authorization Token is missing" };
    const access_token = bearerToken.slice("Bearer ".length);
    console.log(access_token);
    if (!access_token)
      throw { name: "JsonWebTokenError", message: "Invalid Token" };
    const { id } = verifyToken(access_token);

    const user = await User.FindByPk(id);
    console.log(user);

    // if (!user) throw { name: "unauthorized", message: "User not authorized" };
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authentication;
