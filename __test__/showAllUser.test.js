const app = require("../app");
const request = require("supertest");

describe.skip("get /showAllUser", () => {
  describe("succes", () => {
    test("should able register user ", async () => {
      const respons = await request(app).get("/showAllUser");

      //   expect(respons.status).toBe(201);
    });
  });
});
