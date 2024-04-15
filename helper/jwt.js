const jsonwebtoken = require("jsonwebtoken");

const secret = "apajalah";

function signToken(value) {
  return jsonwebtoken.sign(value, secret);
}

function verifyToken(value) {
  return jsonwebtoken.verify(value, secret);
}
module.exports = { signToken, verifyToken };
