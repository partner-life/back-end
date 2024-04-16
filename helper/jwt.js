const jsonwebtoken = require("jsonwebtoken");

const secret = "apajalah";

function signToken(value) {
  return jsonwebtoken.sign(value, secret);
}

function verifyToken(access_token) {
  return jsonwebtoken.verify(access_token, secret);
}
module.exports = { signToken, verifyToken };
