const Orders = require("../model/order");

class OrdersController {
  static async createOrders(req, res, next) {
    try {
      const {
        nameHusband,
        nameWife,
        address,
        phoneNumber,
        dateOfMerried,
        ProductId,
      } = req.body;

      if (!nameHusband)
        throw { name: "BadRequest", message: "name of husband is required" };
      if (!nameWife)
        throw { name: "BadRequest", message: "name of wife is required" };
      if (!address)
        throw { name: "BadRequest", message: "address is required" };
      if (!phoneNumber)
        throw { name: "BadRequest", message: "phone number is required" };
      if (!dateOfMerried)
        throw { name: "BadRequest", message: "date is required" };
      if (new Date(dateOfMerried) < new Date()) {
        throw {
          name: "BadRequest",
          message: "Date of marriage cannot be before today",
        };
      }

      const userId = req.user._id;
      const result = await Orders.newOrders(
        userId,
        ProductId,
        address,
        nameHusband,
        nameWife,
        phoneNumber,
        dateOfMerried
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = OrdersController;
