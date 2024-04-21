const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

function signToken(value) {
  return jsonwebtoken.sign(value, secret);
}

function verifyToken(access_token) {
  return jsonwebtoken.verify(access_token, secret);
}
module.exports = { signToken, verifyToken };
