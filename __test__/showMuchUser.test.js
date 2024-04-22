const app = require("../app");
const request = require("supertest");

describe("get /showMuchUser", () => {
  describe("succes", () => {
    test("should able register user ", async () => {
      const respons = await request(app).get("/showMuchUser");
      console.log(respons.body);
      //   expect(respons.status).toBe(201);
    });
  });
});
