const midtransClient = require("midtrans-client");
const payment = require("../model/payment");
const Orders = require("../model/order");
const { ObjectId } = require("mongodb");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

class PaymentController {
  static async createTransaction(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await Orders.ordersById(new ObjectId(orderId));
      if (!order) {
        throw { name: "NotFound", message: "Order not found" };
      }
      const { username } = req.user;
      const { gross_amount, order_id, item_name } = req.body;
      const amount = Number(gross_amount);

      if (!order_id || !item_name) {
        throw { name: "BadRequest", message: "Order ID and Item Name are required" };
      }

      const parameter = {
        transaction_details: {
          order_id: `${order_id}_${Math.floor(1000000 + Math.random() * 9000000)}`,
          gross_amount: amount,
        },
        item_details: [
          {
            id: order_id,
            price: amount,
            name: item_name,
            quantity: 1,
          },
        ],
        customer_details: {
          first_name: username,
          phone: order.Profile.phoneNumber,
          shipping_address: {
            address: order.Profile.address,
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

  static async handleNotification(req, res, next) {
    try {
      const notificationJson = req.body;
      console.log("🚀 ~ PaymentController ~ handleNotification ~ notificationJson:", notificationJson);
      const statusResponse = await snap.transaction.notification(notificationJson);
      console.log("🚀 ~ PaymentController ~ handleNotification ~ statusResponse:", statusResponse);

      const [order_id, randomNumber] = statusResponse.order_id.split("_");
      const transactionStatus = statusResponse.transaction_status;

      if (transactionStatus == "settlement") {
        await payment.updateOrderStatus(order_id, "Sudah dibayar");
        res.status(200).send({ message: "Success Payment" });
      } else if (transactionStatus == "pending") {
        await payment.updateOrderStatus(order_id, "Belum dibayar");
        res.status(200).send({ message: "Pending Payment" });
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
}

module.exports = PaymentController;
