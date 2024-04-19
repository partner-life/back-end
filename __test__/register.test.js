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
        username: "test3",
        email: "test3@mail.com",
        password: "test",
      });
    });
  });
  describe("failed", () => {
    test("returning error", async () => {
      const respons = await request(app).post("/register").send({
        name: "test3",
        username: "",
        email: "test3@mail.com",
        password: "test",
      });

      expect(respons.status).toBe(400);
    });
    test("returning error", async () => {
      const respons = await request(app).post("/register").send({
        name: "test3",
        username: "test3",
        email: "",
        password: "test",
      });

      expect(respons.status).toBe(400);
    });
    test("returning error", async () => {
      const respons = await request(app).post("/register").send({
        name: "test3",
        username: "test3",
        email: "test1@mail.com",
        password: "",
      });

      expect(respons.status).toBe(400);
    });
    test("returning error", async () => {
      const respons = await request(app).post("/register").send({
        name: "test3",
        username: "test1",
        email: "tes31@mail.com",
        password: "test",
      });

      expect(respons.status).toBe(400);
    });
    test("returning error", async () => {
      const respons = await request(app).post("/register").send({
        name: "test3",
        username: "test14",
        email: "test1@mail.com",
        password: "test",
      });

      expect(respons.status).toBe(400);
    });
  });
});
afterAll(async () => {
  await database.collection("Users").deleteOne({ name: userData.name });
});
