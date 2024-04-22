const app = require("../app");
const request = require("supertest");

describe("get /allOrders", () => {
  describe("succes", () => {
    test("should able register user ", async () => {
      const respons = await request(app).get("/allOrders");

      expect(respons.status).toBe(200);
    });
  });
});
