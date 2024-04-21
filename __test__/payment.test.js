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
      .post("/create-transaction")
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

    const res = await request(app).post("/create-transaction").send(transactionData);

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
      .post("/create-transaction")
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
      .post("/create-transaction")
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
      .post("/create-transaction")
      .send(transactionData)
      .set("Authorization", "Bearer " + access_tokenUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Order ID and Item Name are required");
  });
});
