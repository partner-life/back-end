const midtransClient = require("midtrans-client");
const payment = require("../model/payment");
const { ObjectId } = require("mongodb");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

class PaymentController {
  static async createTransaction(req, res, next) {
    try {
      const { gross_amount, order_id, item_name, first_name, last_name, phone, address, city, postal_code } = req.body;

      const amount = +gross_amount;

      if (typeof amount !== "number") {
        throw { name: "BadRequest", message: "Amount must be a number" };
      }

      if (!order_id || !item_name) {
        throw { name: "BadRequest", message: "Order ID and Item Name are required" };
      }

      const parameter = {
        transaction_details: {
          order_id,
          gross_amount: amount,
        },
        item_details: [
          {
            id: order_id,
            price: amount,
            quantity: 1,
            name: item_name,
          },
        ],
        customer_details: {
          first_name,
          last_name,
          phone,
          shipping_address: {
            address,
            city,
            postal_code,
          },
        },
      };

      const transaction = await snap.createTransaction(parameter);

      res.status(200).json(transaction);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
  static async handlingAfterPayment(req, res, next) {
    try {
      const { order_id, transaction_status } = req.body;

      const data = await payment.findOrderById(new ObjectId(order_id));
      console.log("🚀 ~ PaymentController ~ handlingAfterPayment ~ data:", data);
      if (!data) {
        throw { name: "NotFound", message: "Order not found" };
      }

      const status = await payment.updateOrderStatus(order_id, transaction_status);
      if (status.modifiedCount === 1) {
        res.status(200).json({ message: "Payment is successful" });
      } else {
        res.status(400).json({ message: "Payment failed" });
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
}

module.exports = PaymentController;
