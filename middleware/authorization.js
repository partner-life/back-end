// const user = require("../models/user");

const Orders = require("../model/order");

const authorization = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const dataOrder = await Orders.findOrderById(orderId);
    if (!dataOrder) {
      throw { name: "NotFound", message: `order not found` };
    }

    // console.log(userId);
    if (dataOrder.UserId !== userId) {
      throw {
        name: "Forbidden",
        message: "You're not authorized",
      };
    }
    req.game = dataOrder;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authorization;
