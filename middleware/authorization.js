// const user = require("../models/user");

const Product = require("../model/product");

const authorization = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const dataCart = await Product.findProductById(productId);

    if (!dataCart) {
      throw { name: "NotFound", message: `product not found` };
    }

    // console.log(userId);
    if (dataCart.UserId !== userId) {
      throw {
        name: "Forbidden",
        msg: `You're not authorized`,
      };
    }
    req.game = dataCart;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authorization;
