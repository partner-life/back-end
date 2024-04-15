const bcrypt = require("bcryptjs");
function hash(value) {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(value, salt);
  return (value = hash);
}
module.exports = hash;
