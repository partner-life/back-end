const app = require("../app");
const request = require("supertest");

describe("get /totalPrice", () => {
  describe("succes", () => {
    test("should able register user ", async () => {
      const respons = await request(app).get("/totalPrice");

      expect(respons.status).toBe(200);
    });
  });
});
