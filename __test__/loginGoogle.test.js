const app = require("../app");
const database = require("../config/db");
const request = require("supertest");

const userData = {
  tokenGoogle:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUxYjkzYzY0MDE0NGI4NGJkMDViZjI5NmQ2NzI2MmI2YmM2MWE0ODciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNjkxMTYyMDUzNTMtdjczNnRhY3ZudXZwaWMyMmQzZGl2dHRuaW0wM29pb2QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNjkxMTYyMDUzNTMtdjczNnRhY3ZudXZwaWMyMmQzZGl2dHRuaW0wM29pb2QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE5MzI2MjE4MDMxNjEyMTYzMzAiLCJlbWFpbCI6ImFiZHVsLmFyaWZpbjY3NjdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTcxMzkzODM2NSwibmFtZSI6ImFiZHVsIGFyaWZpbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKelBBelU3bUlpVVhfbV96Q2VkdXFNOHU2V084QkVNa1ByazFUNVJ1dXFMUFFGOUE9czk2LWMiLCJnaXZlbl9uYW1lIjoiYWJkdWwiLCJmYW1pbHlfbmFtZSI6ImFyaWZpbiIsImlhdCI6MTcxMzkzODY2NSwiZXhwIjoxNzEzOTQyMjY1LCJqdGkiOiI2MDVkM2MzNGE1NTY5NGJlNWFhMTg2NGUwZTY2NDJhOWU3NWNkODlmIn0.IBHDN63rLPIqaryQylTUMg1i5U0c4HiDeEO_yMoH9AQXwUnY-Lb28zzkbHslbs6NDj8eJhM2zAKecAwkhL6R9ENrsmm3dJBSPTKLuXkW0MJo1kFIwW04E_LKQENLS59_vw4ZXqHWg6mUtLwAzGATi3NNCFSbeJOluWpnXdAjcEOBnrVlwYa_ivuVsCyj5XyCVy6lFRZt9p9KB_95Ekv8sbgXMmVjt9O8jIG8TqwyQwHgfUr6bzyM4zxLoFl6afual44ZSGG0ZvHI83PoctbwDqEqrnczcAmIoS5LvjPjW3G4B4BubwTMIYfPdoHnAnQboClxq2-UbZovWNsap1DrzQ",
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
