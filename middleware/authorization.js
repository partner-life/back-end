// const user = require("../models/user");

const Orders = require("../model/order");

const authorization = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const userId = req.user._id;

    const dataOrder = await Orders.ordersById(orderId);

    // if (!dataOrder) {
    //   throw { name: "NotFound", message: `order not found` };
    // }

    if (String(userId) !== String(dataOrder.UserId))
      throw { name: "Forbidden", message: "you are not authorized" };
    req.order = dataOrder;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authorization;
