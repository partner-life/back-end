const app = require("../app");
const database = require("../config/db");
const request = require("supertest");
const Orders = require("../model/order");
const OrdersController = require("../controller/orders");
const { signToken } = require("../helper/jwt");

beforeAll(async () => {
  let data = {
    email: "testing@mail.com",
    password: "testing",
  };
  const login = await database
    .collection("Users")
    .findOne({ email: data.email });
  access_token = signToken({ id: login._id });
});

let access_token;

describe("POST /historyOrder", () => {
  test("should be able to update order", async () => {
    // console.log(access_token)
    const response = await request(app)
      .get("/historyOrder")
      .set("Authorization", "Bearer " + access_token);

    // console.log(response.body);
  });

  test("should return error if husbandName is missing", async () => {
    const response = await request(app)
      .get("/historyOrder")
      .set("Authorization", "Bea " + access_token);

    console.log(response.body);
    // expect(response.status).toBe(400);
  });
});
