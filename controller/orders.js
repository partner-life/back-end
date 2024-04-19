const Orders = require("../model/order");
const database = require("../config/db");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");

class OrdersController {
   static async createOrders(req, res, next) {
      try {
         const { nameHusband, nameWife, address, phoneNumber, dateOfMerried, packetId } = req.body;

         if (!nameHusband) throw { name: "BadRequest", message: "name of husband is required" };
         if (!nameWife) throw { name: "BadRequest", message: "name of wife is required" };
         if (!address) throw { name: "BadRequest", message: "address is required" };
         if (!phoneNumber) throw { name: "BadRequest", message: "phone number is required" };
         if (!dateOfMerried) throw { name: "BadRequest", message: "date is required" };
         if (new Date(dateOfMerried) < new Date()) {
            throw {
               name: "BadRequest",
               message: "Date of marriage cannot be before today",
            };
         }

         const userId = req.user._id;
         const newOrder = await Orders.newOrders(userId, packetId, address, phoneNumber, nameHusband, nameWife, dateOfMerried);
         const orderId = newOrder._id;

         req.body.id = orderId;
         await OrdersController.nodemailer(req, res, next);
         
         // res.status(201).json(newOrder);
      } catch (error) {
         next(error);
      }
   }

   static async nodemailer(req, res, next) {
      try {
         const { id: orderId } = req.body;
         const user = req.user;

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
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pembayaran</title>
          <style>
             body {
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                margin: 0;
                padding: 0;
             }
             .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
             }
             h1 {
                color: #333;
                text-align: center;
             }
             p {
                color: #666;
                line-height: 1.5;
             }
             .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                transition: background-color 0.3s ease;
             }
             .button:hover {
                background-color: #0056b3;
             }
          </style>
       </head>
       <body>
          <div class="container">
             <h1>Halo ${user.name},</h1>
             <p>Terima kasih telah menggunakan layanan kami. Anda memiliki pembayaran yang harus diselesaikan.</p>
             <p>Silakan klik tautan di bawah ini untuk melihat detail pembayaran:</p>
             <a href="${process.env.URL_CLIENT}/payment/${orderId}/${user._id}" class="button" style="color: white;">Lihat Detail Pembayaran</a>
             <p>Jika Anda memiliki pertanyaan atau membutuhkan bantuan lebih lanjut, jangan ragu untuk menghubungi kami.</p>
             <p>Terima kasih.</p>
          </div>
       </body>
       </html>
       `;

         await transporter.sendMail({
            from: "partner-life",
            to: user.email,
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

module.exports = OrdersController;