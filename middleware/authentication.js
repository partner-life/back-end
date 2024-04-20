const { verifyToken } = require("../helper/jwt");
const User = require("../model/user");

const authentication = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) throw { name: "unauthorized", message: "Invalid Token1" };
    const access_token = bearerToken.slice("Bearer ".length);

    if (!access_token) throw { name: "unauthorized", message: "Invalid Token2" };
    const { id } = verifyToken(access_token);

    const user = await User.FindByPk(id);

    if (!user) throw { name: "unauthorized", message: "Invalid Token3" };
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authentication;
