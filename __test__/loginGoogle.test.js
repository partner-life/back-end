const app = require("../app");
const database = require("../config/db");
const request = require("supertest");

const userData = {
  tokenGoogle:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZjZTExYWVjZjllYjE0MDI0YTQ0YmJmZDFiY2Y4YjMyYTEyMjg3ZmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNjkxMTYyMDUzNTMtdjczNnRhY3ZudXZwaWMyMmQzZGl2dHRuaW0wM29pb2QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNjkxMTYyMDUzNTMtdjczNnRhY3ZudXZwaWMyMmQzZGl2dHRuaW0wM29pb2QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE5MzI2MjE4MDMxNjEyMTYzMzAiLCJlbWFpbCI6ImFiZHVsLmFyaWZpbjY3NjdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTcxMzgxMTMxNSwibmFtZSI6ImFiZHVsIGFyaWZpbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKelBBelU3bUlpVVhfbV96Q2VkdXFNOHU2V084QkVNa1ByazFUNVJ1dXFMUFFGOUE9czk2LWMiLCJnaXZlbl9uYW1lIjoiYWJkdWwiLCJmYW1pbHlfbmFtZSI6ImFyaWZpbiIsImlhdCI6MTcxMzgxMTYxNSwiZXhwIjoxNzEzODE1MjE1LCJqdGkiOiI0ZjViNzBkYjc3ZTFiMjAxYTMwN2FhMThiZjBlZWIxNGM3ZTkzZTA3In0.Q7QFQUMdQ1rY6TeLD8w3al1YhxCZ9dE3icrMvu7q1zg4D5pIiBDk-SmF_0kodPb54uJeM1Nipsxrj1Gz6WQLTmvyDFhkTP5WSSSYSYEgTc1e61q2UXA5d9uu2saB5fFXGft6t0kOF1n1wEiX0KtYc4NfHXEScPFS47VKKJy5n-H-l1ohj5BwBWTbXItmU_pJr-nVLySIR0cVMUrXusUW_5xvPJtOtxHToS5nIu43gGFS9OHR0z7vQqspUnuguwn41llUpSgOYhonMgMwTas5cH1WyAG5KJLW4Vt0bZlslvQ9_AWkLgtpwViZrugmJHi0xiiqS6_Qk2JW02mG-K6_Cw",
};
describe("POST /login", () => {
  //!test login user berhasil
  describe("succes", () => {
    test("should able login user ", async () => {
      const respons = await request(app).post("/google-login").send(userData);

      expect(respons.status).toBe(201);
    });
  });
  describe("failed", () => {
    test("returning error", async () => {
      const respons = await request(app)
        .post("/google-login")
        .send({ tokenGoogle: "sda" });
    });
  });
  describe("failed", () => {
    test("returning error", async () => {
      const respons = await request(app)
        .post("/google-login")
        .send({ tokenGoogle: "" });
    });
  });
});

// afterAll(async () => {
//   await database.collection("Users").deleteOne({ name: userData.name });
// });
