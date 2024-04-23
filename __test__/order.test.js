const app = require("../app");
const database = require("../config/db");
const request = require("supertest");
const Orders = require("../model/order");
const OrdersController = require("../controller/orders");
const { signToken } = require("../helper/jwt");

beforeAll(async () => {
  let data = {
    email: "rohimjoy70@gmail.com",
    password: "test",
  };
  const login = await database
    .collection("Users")
    .findOne({ email: data.email });
  access_token = signToken({ id: login._id });
});

let access_token;

const userData = {
  HusbandName: "Toba",
  WifeName: "NameOfWife",
  address: "123 Main Street",
  phoneNumber: "123-456-7890",
  dateOfMerried: "2024-05-01",
};

describe("POST /addOrders", () => {
  test("should be able to add order", async () => {
    // console.log(access_token)
    const response = await request(app)
      .post("/addOrders/66223439ea966fac0f1487a2")
      .set("Authorization", "Bearer " + access_token)
      .send(userData);
    console.log(response.body);
  });

  test("should return error if nameHusband is missing", async () => {
    const { HusbandName, ...userDataWithoutNameHusband } = userData;

    const response = await request(app)
      .post("/addOrders/66223439ea966fac0f1487a2")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutNameHusband);

    expect(response.status).toBe(400);
  });

  test("should return error if nameWife is missing", async () => {
    const { WifeName, ...userDataWithoutNameWife } = userData;

    const response = await request(app)
      .post("/addOrders/66223439ea966fac0f1487a2")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutNameWife);

    expect(response.status).toBe(400);
  });
  test("should return error if nameWife is missing", async () => {
    const { address, ...userDataWithoutAddress } = userData;

    const response = await request(app)
      .post("/addOrders/66223439ea966fac0f1487a2")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutAddress);

    expect(response.status).toBe(400);
  });
  test("should return error if nameWife is missing", async () => {
    const { phoneNumber, ...userDataWithoutPhoneNumber } = userData;

    const response = await request(app)
      .post("/addOrders/66223439ea966fac0f1487a2")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutPhoneNumber);

    expect(response.status).toBe(400);
  });
  test("should return error if nameWife is missing", async () => {
    const { dateOfMerried, ...userDataWithoutDate } = userData;

    const response = await request(app)
      .post("/addOrders/66223439ea966fac0f1487a2")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutDate);

    expect(response.status).toBe(400);
  });
  test("should return error if nameWife is missing", async () => {
    const response = await request(app)
      .post("/addOrders/")
      .set("Authorization", "Bearer " + access_token)
      .send(userData);

    expect(response.status).toBe(404);
  });
  test("should return error if nameWife is missing", async () => {
    const response = await request(app)
      .post("/addOrders/16784232")
      .set("Authorization", "Bearer " + access_token)
      .send(userData);
    console.log(response.body);

    expect(response.status).toBe(404);
  });
  test("should return error if nameWife is missing", async () => {
    const response = await request(app)
      .post("/addOrders/66234fdc5de01fedc08b3fcf")
      .set("Authorization", "Bearer " + access_token)
      .send({
        HusbandName: "Toba",
        WifeName: "NameOfWife",
        address: "123 Main Street",
        phoneNumber: "123-456-7890",
        dateOfMerried: "2024-04-01",
      });
    console.log(response.body);

    expect(response.status).toBe(400);
  });
});

afterAll(async () => {
  await database
    .collection("Orders")
    .deleteOne({ Profil: { HusbandName: userData.nameHusband } });
});
