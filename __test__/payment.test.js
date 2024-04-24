const request = require("supertest");
const { ObjectId } = require("mongodb");
const database = require("../config/db");
const app = require("../app");
const PaymentController = require("../controller/payment");
const { signToken } = require("../helper/jwt");
const Package = require("../model/package");

let access_tokenAdmin;
let access_tokenUser;

beforeAll(async () => {
  const packageData = {
    _id: new ObjectId("666666666666666666666666"),
    name: "Test name",
    imageUrl: "test.jpg",
    description: "This is a npm test",
    category: "Sample Category",
    price: 1000,
  };
  const data = await Package.createPackage(packageData);
  console.log("🚀 ~ beforeAll ~ data:", data);

  let dataAdmin = {
    email: "admin@mail.com",
    password: "12345",
  };
  const loginAdmin = await database.collection("Users").findOne({ email: dataAdmin.email });
  access_tokenAdmin = signToken({ id: loginAdmin._id });
  let dataUser = {
    email: "user@mail.com",
    password: "12345",
  };
  const loginUser = await database.collection("Users").findOne({ email: dataUser.email });
  access_tokenUser = signToken({ id: loginUser._id });
});

afterAll(async () => {
  const packageId = new ObjectId("666666666666666666666666");
  await Package.deletePackage(packageId);
  console.log("done");
});

// describe("POST /handling-after-payment", () => {});

describe("POST /create-transaction", () => {
  test("should return error if order id not found", async () => {
    const res = await request(app)
      .post("/create-transaction/999999999999999999999999")
      .send(null)
      .set("Authorization", "Bearer " + access_tokenUser);

    expect(res.body.message).toEqual("Order not found");
    expect(res.statusCode).toEqual(404);
  });
  test("should create a new transaction", async () => {
    const transactionData = {
      gross_amount: 100,
      order_id: String(Math.floor(1000000 + Math.random() * 9000000)),
      item_name: "Test Item",
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
      address: "123 Street",
      city: "City",
      postal_code: "12345",
    };

    const res = await request(app)
      .post("/create-transaction/6627b5033118651ebe69b532")
      .send(transactionData)
      .set("Authorization", "Bearer " + access_tokenUser);

    // expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("redirect_url");
  });

  test("should add a new test if no Authorization provided", async () => {
    const transactionData = {
      gross_amount: 100,
      order_id: "123456",
      item_name: "Test Item",
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
      address: "123 Street",
      city: "City",
      postal_code: "12345",
    };

    const res = await request(app).post("/create-transaction/6627b5033118651ebe69b532").send(transactionData);

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Authorization Token is missing");
  });

  test("should add a new test if order id is missing", async () => {
    const transactionData = {
      gross_amount: 100,
      item_name: "Test Item",
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
      address: "123 Street",
      city: "City",
      postal_code: "12345",
    };

    const res = await request(app)
      .post("/create-transaction/6627b5033118651ebe69b532")
      .send(transactionData)
      .set("Authorization", "Bearer " + access_tokenUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Order ID and Item Name are required");
  });
  test("should add a new test if item name is missing", async () => {
    const transactionData = {
      order_id: "123456",
      gross_amount: 100,
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
      address: "123 Street",
      city: "City",
      postal_code: "12345",
    };

    const res = await request(app)
      .post("/create-transaction/6627b5033118651ebe69b532")
      .send(transactionData)
      .set("Authorization", "Bearer " + access_tokenUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Order ID and Item Name are required");
  });
  test("should add a new test if item name and order id is missing", async () => {
    const transactionData = {
      gross_amount: 100,
      first_name: "John",
      last_name: "Doe",
      phone: "1234567890",
      address: "123 Street",
      city: "City",
      postal_code: "12345",
    };

    const res = await request(app)
      .post("/create-transaction/6627b5033118651ebe69b532")
      .send(transactionData)
      .set("Authorization", "Bearer " + access_tokenUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Order ID and Item Name are required");
  });
});

describe("POST /handling-after-payment", () => {
  test("should handle payment notification successfully", async () => {
    const notificationJson = {
      status_code: "200",
      transaction_id: "f74bea06-5cbd-44a9-8fb2-82072707e734",
      gross_amount: "980000.00",
      currency: "IDR",
      order_id: "6627f621c7f6e9a018c84e60_7053227",
      payment_type: "bank_transfer",
      signature_key:
        "4e1fb397f971bdb569f6972f218e61cc1cf7aaedb6aa1085daf9e978ebcaa95f584297450db354bd624c9d37ec0779e326ded1c2fed6fd3a22e03ade6a78b84d",
      transaction_status: "settlement",
      fraud_status: "accept",
      status_message: "Success, transaction is found",
      merchant_id: "G639025300",
      va_numbers: [{ bank: "bca", va_number: "25300958756" }],
      payment_amounts: [],
      transaction_time: "2024-04-24 12:01:55",
      settlement_time: "2024-04-24 12:02:05",
      expiry_time: "2024-04-25 12:01:55",
    };

    const res = await request(app).post("/handling-after-payment").send(notificationJson);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("success");
  });
  test("Should handle pending payment notifications", async () => {
    const notificationJson = {
      status_code: "201",
      transaction_id: "db1837a9-daaf-4e91-9523-3544ca07c692",
      gross_amount: "980000.00",
      currency: "IDR",
      order_id: "6627f621c7f6e9a018c84e60_5952648",
      payment_type: "bank_transfer",
      signature_key:
        "a18f7440a9a5c95bd471eba8410580807f24390e68280563a0a6e9028a7623140f46ecd505be5a4b1f73fa5481ff5d70594d985a1bb2cfb85ed4857991655c23",
      transaction_status: "pending",
      fraud_status: "accept",
      status_message: "Success, transaction is found",
      merchant_id: "G639025300",
      va_numbers: [{ bank: "bca", va_number: "25300257208" }],
      payment_amounts: [],
      transaction_time: "2024-04-24 12:00:51",
      expiry_time: "2024-04-25 12:00:51",
    };

    const res = await request(app).post("/handling-after-payment").send(notificationJson);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Pending Payment");
  });
});
