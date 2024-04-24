const app = require("../app");
const database = require("../config/db");
const request = require("supertest");
const Orders = require("../model/order");
const OrdersController = require("../controller/orders");
const { signToken } = require("../helper/jwt");
const Package = require("../model/package");
const User = require("../model/user");

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

const userData = {
  husbandName: "Toba",
  wifeName: "NameOfWife",
  address: "123 Main Street",
  phoneNumber: "123-456-7890",
  dateOfMerried: "2024-05-01",
};

describe("POST /updateOrders/:orderId", () => {
  test("should be able to update order", async () => {
    // console.log(access_token)
    const response = await request(app)
      .put("/updateOrders/66289c73324956ed53ead698")
      .set("Authorization", "Bearer " + access_token)
      .send(userData);
    // console.log(response.body);
  });

  test("should return error if husbandName is missing", async () => {
    const { husbandName, ...userDataWithoutHusbandName } = userData;

    const response = await request(app)
      .put("/updateOrders/66289c73324956ed53ead698")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutHusbandName);

    expect(response.status).toBe(400);
  });

  test("should return error if wifeName is missing", async () => {
    const { wifeName, ...userDataWithoutWifeName } = userData;

    const response = await request(app)
      .put("/updateOrders/66289c73324956ed53ead698")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutWifeName);

    expect(response.status).toBe(400);
  });
  test("should return error if wifeName is missing", async () => {
    const { address, ...userDataWithoutAddress } = userData;

    const response = await request(app)
      .put("/updateOrders/66289c73324956ed53ead698")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutAddress);

    expect(response.status).toBe(400);
  });
  test("should return error if wifeName is missing", async () => {
    const { phoneNumber, ...userDataWithoutPhoneNumber } = userData;

    const response = await request(app)
      .put("/updateOrders/66289c73324956ed53ead698")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutPhoneNumber);

    expect(response.status).toBe(400);
  });
  test("should return error if wifeName is missing", async () => {
    const { dateOfMerried, ...userDataWithoutDate } = userData;

    const response = await request(app)
      .put("/updateOrders/66289c73324956ed53ead698")
      .set("Authorization", "Bearer " + access_token)
      .send(userDataWithoutDate);

    expect(response.status).toBe(400);
  });
  test("should return error if wifeName is missing", async () => {
    const response = await request(app)
      .put("/updateOrders/")
      .set("Authorization", "Bearer " + access_token)
      .send(userData);

    expect(response.status).toBe(404);
  });
  test("should return error if wifeName is missing", async () => {
    const response = await request(app)
      .put("/updateOrders/6627f38c3dfeb958989204b5")
      .set("Authorization", "Bearer " + access_token)
      .send(userData);

    expect(response.status).toBe(403);
  });
  test("should return error if wifeName is missing", async () => {
    const response = await request(app)
      .put("/updateOrders/66289c73324956ed53ead698")
      .set("Authorization", "Bearer " + access_token)
      .send({
        husbandName: "Toba",
        wifeName: "NameOfWife",
        address: "123 Main Street",
        phoneNumber: "123-456-7890",
        dateOfMerried: "2024-04-01",
      });
    console.log(response.body);

    expect(response.status).toBe(400);
  });
  test("should return error if wifeName is missing", async () => {
    const response = await request(app)
      .put("/updateOrders/66289c73324956ed53ead698")
      // .set("Authorization", "Bearer " + "687126786")
      .send({
        husbandName: "Toba",
        wifeName: "NameOfWife",
        address: "123 Main Street",
        phoneNumber: "123-456-7890",
        dateOfMerried: "2024-04-01",
      });
    console.log(response.body);

    expect(response.status).toBe(401);
  });
  test("should return error if wifeName is missing", async () => {
    const response = await request(app)
      .put("/updateOrders/66289c73324956ed53ead698")
      .set("Authorization", "Bearer ")
      .send({
        husbandName: "Toba",
        wifeName: "NameOfWife",
        address: "123 Main Street",
        phoneNumber: "123-456-7890",
        dateOfMerried: "2024-04-01",
      });
    console.log(response.body);

    expect(response.status).toBe(401);
  });
});

// afterAll(async () => {
//   await database
//     .collection("Orders")
//     .deleteOne({ Profil: { husbandName: userData.husbandName } });
// });
