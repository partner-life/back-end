const app = require("../app");
const database = require("../config/db");
const request = require("supertest");

const userData = {
  name: "test",
  username: "test",
  email: "test@mail.com",
  password: "test",
};
describe("POST /register", () => {
  //!test register user berhasil
  describe("succes", () => {
    test("should able register user ", async () => {
      const respons = await request(app).post("/register").send(userData);

      expect(respons.status).toBe(201);
    });
  });
  describe("failed", () => {
    test("returning error", async () => {
      await request(app).post("/register").send({
        name: "",
        username: "test",
        email: "test@mail.com",
        password: "test",
      });
    });
  });
  describe("failed", () => {
    test("returning error", async () => {
      const respons = await request(app).post("/register").send({
        name: "test",
        username: "",
        email: "test@mail.com",
        password: "test",
      });

      expect(respons.status).toBe(400);
    });
  });
});
afterAll(async () => {
  await database.collection("Users").deleteOne({ name: userData.name });
});
