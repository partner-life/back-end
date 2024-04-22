const app = require("../app");
const database = require("../config/db");
const request = require("supertest");

const userData = {
  email: "test1@mail.com",
  password: "test1",
};
describe.skip("POST /login", () => {
  //!test login user berhasil
  describe("succes", () => {
    test("should able register user ", async () => {
      const respons = await request(app).post("/login").send(userData);

      expect(respons.status).toBe(200);
    });
  });
  describe("failed", () => {
    test("returning error", async () => {
      const respons = await request(app).post("/login").send({
        email: "test@mail.com",
        password: "12",
      });
    });
  });
  describe("failed", () => {
    test("returning error", async () => {
      const respons = await request(app).post("/login").send({
        email: "test3@mail.com",
        password: "test",
      });

      expect(respons.status).toBe(401);
    });
  });
  describe("failed", () => {
    test("returning error", async () => {
      const respons = await request(app).post("/login").send({
        email: "test3@mail.com",
        password: "",
      });

      expect(respons.status).toBe(400);
    });
  });
  describe("failed", () => {
    test("returning error", async () => {
      const respons = await request(app).post("/login").send({
        email: "",
        password: "test",
      });

      expect(respons.status).toBe(400);
    });
  });
  describe("failed", () => {
    test("returning error", async () => {
      const respons = await request(app).post("/login").send({
        email: "test1@mail.com",
        password: "test3",
      });

      expect(respons.status).toBe(401);
    });
  });
});
// afterAll(async () => {
//   await database.collection("Users").deleteOne({ name: userData.name });
// });
