const app = require("../app");
const request = require("supertest");

describe("get /", () => {
  describe("succes", () => {
    test("should able register user ", async () => {
      const respons = await request(app).get("/");

      //   expect(respons.status).toBe(201);
    });
  });
});
