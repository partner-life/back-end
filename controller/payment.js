const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

class PaymentController {
  static async createTransaction(req, res, next) {
    try {
      const { gross_amount, order_id, description } = req.body;

      const amount = +gross_amount;

      if (typeof amount !== "number") {
        throw { name: "BadRequest", message: "Amount must be a number" };
      }

      if (!order_id || !description) {
        throw { name: "BadRequest", message: "Order ID and Description are required" };
      }

      const parameter = {
        transaction_details: {
          order_id,
          gross_amount: amount,
          description,
        },
      };

      const transaction = await snap.createTransaction(parameter);

      res.status(200).json(transaction);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
}

module.exports = PaymentController;
