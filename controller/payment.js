const midtransClient = require("midtrans-client");
const payment = require("../model/payment");
const Orders = require("../model/order");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");

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
        throw {
          name: "BadRequest",
          message: "Order ID and Item Name are required",
        };
      }

      const parameter = {
        transaction_details: {
          order_id: `${order_id}_${Math.floor(
            1000000 + Math.random() * 9000000
          )}`,
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
      // console.log("🚀 ~ PaymentController ~ handleNotification ~ notificationJson:", notificationJson);
      const statusResponse = await snap.transaction.notification(
        notificationJson
      );
      // console.log("🚀 ~ PaymentController ~ handleNotification ~ statusResponse:", statusResponse);

      const [order_id, randomNumber] = statusResponse.order_id.split("_");
      const transactionStatus = statusResponse.transaction_status;

      if (transactionStatus == "settlement") {
        await payment.updateOrderStatus(order_id, "Sudah Dibayar");
        await PaymentController.paidNodemailer(req, res, next);
        // res.status(200).send({ message: "Success Payment" });
      } else if (transactionStatus == "pending") {
        await payment.updateOrderStatus(order_id, "Belum dibayar");
        res.status(200).send({ message: "Pending Payment" });
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  static async paidNodemailer(req, res, next) {
    try {
      const { order_id, gross_amount } = req.body;
      const [id, randomNumber] = order_id.split("_");
      // console.log(id, "id masuk <<<<<<");
      // console.log(order_id, "order id <<<<<<");
      // console.log(gross_amount, "price <<<<<<");
      const order = await Orders.findOrderById(new ObjectId(id));
      const emailToUser = order[0].User[0].email;
      const username = order[0].User[0].name;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "rohimsaga3@gmail.com",
          pass: "eurr llei kigc dhgx",
        },
      });

      const htmlTemplate = `
         <!DOCTYPE html>
         <html lang="en">
            <head>
               <meta charset="UTF-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1.0" />
               <title>Terima Kasih</title>
               <style>
                  body {
                     font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                     background-color: #f9f9f9;
                     margin: 0;
                     padding: 0;
                     color: #333;
                  }
         
                  .container {
                     max-width: 600px;
                     margin: 20px auto;
                     background-color: #fff;
                     border-radius: 10px;
                     padding: 40px;
                     box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                  }
         
                  h1 {
                     font-family: Times New Roman, Times, serif;
                      color: #fc065c;
                      text-align: start-end;
                      
                  }
         
                  p {
                     line-height: 1.6;
                     margin-bottom: 20px;
                  }
         
                  ul {
                     padding-left: 20px;
                     margin-bottom: 20px;
                  }
         
                  li {
                     list-style-type: disc;
                     margin-bottom: 8px;
                  }
         
                  .footer {
                     margin-top: 30px;
                     font-size: 14px;
                     text-align: center;
                     color: #777;
                  }
               </style>
            </head>
            <body>
               <div class="container">
               <h1>Partner-of-life</h1>
               <h4>Terimakasih ${username},</h4>
                  <p>Pembayaran Anda sebesar <strong>Rp ${gross_amount}</strong> telah berhasil diselesaikan.</p>
                  <p>Berikut adalah detail pembayaran:</p>
                  <ul>
                     <li><strong>Order ID:</strong> ${order_id}</li>
                  </ul>
                  <p>Jika Anda memiliki pertanyaan atau membutuhkan bantuan lebih lanjut, jangan ragu untuk menghubungi kami.</p>
                  <p class="footer">Terima kasih atas kepercayaan anda telah menggunakan partner-of-life.</p>
               </div>
            </body>
         </html>         
          `;

      await transporter.sendMail({
        from: "partner-life",
        to: emailToUser,
        subject: "Hello",
        html: htmlTemplate,
      });

      res.json({
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
