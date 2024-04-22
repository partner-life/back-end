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
    _id: new ObjectId("888888888888888888888888"),
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
  const loginAdmin = await database
    .collection("Users")
    .findOne({ email: dataAdmin.email });
  access_tokenAdmin = signToken({ id: loginAdmin._id });
  let dataUser = {
    email: "user@mail.com",
    password: "12345",
  };
  const loginUser = await database
    .collection("Users")
    .findOne({ email: dataUser.email });
  access_tokenUser = signToken({ id: loginUser._id });
});

afterAll(async () => {
  const packageId = new ObjectId("888888888888888888888888");
  await Package.deletePackage(packageId);
  console.log("done");
});

describe("POST /handling-after-payment", () => {});

describe("POST /create-transaction", () => {
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
      .post("/create-transaction/6625592b3dc9c2355eb60375")
      .send(transactionData)
      .set("Authorization", "Bearer " + access_tokenUser);

    expect(res.statusCode).toEqual(200);
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

    const res = await request(app)
      .post("/create-transaction/6625592b3dc9c2355eb60375")
      .send(transactionData);

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
      .post("/create-transaction/6625592b3dc9c2355eb60375")
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
      .post("/create-transaction/6625592b3dc9c2355eb60375")
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
      .post("/create-transaction/6625592b3dc9c2355eb60375")
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
      transaction_id: "6176c10d-3e30-4094-8c7d-f6b606714294",
      gross_amount: "980000.00",
      currency: "IDR",
      order_id: "662207f6879b096013a84f43_2198720",
      payment_type: "bank_transfer",
      signature_key:
        "6a1dbda2be0b1702bd8bd27edd272ac11e2635ec249f3aff9e99148c7017488860deb1fd057f2c8893b3b14978ce5c479b148ab59849003c67f2cf84c1249c33",
      transaction_status: "settlement",
      fraud_status: "accept",
      status_message: "Success, transaction is found",
      merchant_id: "G639025300",
      va_numbers: [
        {
          bank: "bca",
          va_number: "25300348242",
        },
      ],
      payment_amounts: [],
      transaction_time: "2024-04-21 10:07:25",
      settlement_time: "2024-04-21 10:07:33",
      expiry_time: "2024-04-22 10:07:25",
    };

    const res = await request(app)
      .post("/handling-after-payment")
      .send(notificationJson);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Success Payment");
  });
  test("Should handle pending payment notifications", async () => {
    const notificationJson = {
      status_code: "201",
      transaction_id: "0a7cf8f4-0412-4872-946d-8aa1ca57ce4e",
      gross_amount: "980000.00",
      currency: "IDR",
      order_id: "662207f6879b096013a84f43_6133253",
      payment_type: "bank_transfer",
      signature_key:
        "f061fe3a66a445280dea5ac0531b5b973674883a267d2fe4406b48d3b607a68e55720427d2393e3056b66654f6b7c205dfc1464b2ca4dba116346bed02f924fa",
      transaction_status: "pending",
      fraud_status: "accept",
      status_message: "Success, transaction is found",
      merchant_id: "G639025300",
      va_numbers: [
        {
          bank: "bca",
          va_number: "25300657994",
        },
      ],
      payment_amounts: [],
      transaction_time: "2024-04-21 10:35:44",
      expiry_time: "2024-04-22 10:35:44",
    };

    const res = await request(app)
      .post("/handling-after-payment")
      .send(notificationJson);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Pending Payment");
  });
});
