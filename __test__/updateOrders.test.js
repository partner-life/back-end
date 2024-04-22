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
  let order = await Orders.newOrders(userData);
});

let access_token;
let order;
const userData = {
  UserId: "6624fdb5a004ed8151377370",
  PackageId: "66234fdc5de01fedc08b3fcf",
  status: "false",
  price: 100000000,

  HusbandName: "Toba",
  WifeName: "NameOfWife",
  address: "123 Main Street",
  phoneNumber: "123-456-7890",
  dateOfMerried: "2024-05-01",
};

describe("POST /updateOrders/:orderId", () => {
  test("should be able to update order", async () => {
    // console.log(access_token)
    const response = await request(app)
      .put("/updateOrders/" + order._id)
      .set("Authorization", "Bearer " + access_token)
      .send(userData);
    console.log(response.body);
  });

  test("should return error if nameHusband is missing", async () => {
    const { nameHusband, ...userDataWithoutNameHusband } = userData;

    const response = await request(app)
      .put("/updateOrders/" + order._id)
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutNameHusband);
    console.log(response.body);
    expect(response.status).toBe(400);
  });

  test.skip("should return error if nameWife is missing", async () => {
    const { nameWife, ...userDataWithoutNameWife } = userData;

    const response = await request(app)
      .post("/addOrders/6626178e5d8beda72bc16784")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutNameWife);

    expect(response.status).toBe(400);
  });
  test.skip("should return error if nameWife is missing", async () => {
    const { address, ...userDataWithoutAddress } = userData;

    const response = await request(app)
      .post("/addOrders/66223439ea966fac0f1487a2")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutAddress);

    expect(response.status).toBe(400);
  });
  test.skip("should return error if nameWife is missing", async () => {
    const { phoneNumber, ...userDataWithoutPhoneNumber } = userData;

    const response = await request(app)
      .post("/addOrders/66223439ea966fac0f1487a2")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutPhoneNumber);

    expect(response.status).toBe(400);
  });
  test.skip("should return error if nameWife is missing", async () => {
    const { dateOfMerried, ...userDataWithoutDate } = userData;

    const response = await request(app)
      .post("/addOrders/66223439ea966fac0f1487a2")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutDate);

    expect(response.status).toBe(400);
  });
  test.skip("should return error if nameWife is missing", async () => {
    const response = await request(app)
      .post("/addOrders/")
      .set("Authorization", "Bearer " + access_token)
      .send(userData);

    expect(response.status).toBe(404);
  });
  test.skip("should return error if nameWife is missing", async () => {
    const response = await request(app)
      .post("/addOrders/16783672")
      .set("Authorization", "Bearer " + access_token)
      .send(userData);

    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  await database
    .collection("Orders")
    .deleteOne({ Profil: { nameHusband: userData.nameHusband } });
});
