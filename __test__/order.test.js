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
   const login = await database.collection("Users").findOne({ email: data.email });
   access_token = signToken({ id: login._id });
});

let access_token;

const userData = {
   nameHusband: "Toba",
   nameWife: "NameOfWife",
   address: "123 Main Street",
   phoneNumber: "123-456-7890",
   dateOfMerried: "2024-05-01",
   packetId: "66223439ea966fac0f1487a2",
};

describe("POST /addOrders", () => {
   test("should be able to add order", async () => {
      // console.log(access_token)
      const response = await request(app).post("/addOrders").set("Authorization", "Bearer " + access_token).send(userData);
      console.log(response.body);
      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.Profile.nameHusband).toBe(userData.nameHusband);
      expect(response.body.Profile.nameWife).toBe(userData.nameWife);
      expect(response.body.Profile.address).toBe(userData.address);
      expect(response.body.Profile.phoneNumber).toBe(userData.phoneNumber);
      expect(response.body.Profile.dateOfMerried).toBe(userData.dateOfMerried);

      const createdOrder = await Orders.findOne({ nameHusband: userData.nameHusband });
      expect(createdOrder).toBeDefined();
      expect(createdOrder.nameHusband).toBe(userData.nameHusband);
   });

   test("should return error if nameHusband is missing", async () => {
      const { nameHusband, ...userDataWithoutNameHusband } = userData;

      const response = await request(app).post("/addOrders").set("Authorization", "Bearer " + access_token).send(userDataWithoutNameHusband);

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("name of husband is required");
   });

   test("should return error if nameWife is missing", async () => {
      const { nameWife, ...userDataWithoutNameWife } = userData;

      const response = await request(app).post("/addOrders").set("Authorization", "Bearer " + access_token).send(userDataWithoutNameWife);

      expect(response.status).toBe(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("name of wife is required");
   });
});

afterAll(async () => {
   await database.collection("Orders").deleteOne({ nameHusband: userData.nameHusband });
});
