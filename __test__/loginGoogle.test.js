const app = require("../app");
const database = require("../config/db");
const request = require("supertest");

const userData = {
  tokenGoogle:
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZjZTExYWVjZjllYjE0MDI0YTQ0YmJmZDFiY2Y4YjMyYTEyMjg3ZmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzNjkxMTYyMDUzNTMtdjczNnRhY3ZudXZwaWMyMmQzZGl2dHRuaW0wM29pb2QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIzNjkxMTYyMDUzNTMtdjczNnRhY3ZudXZwaWMyMmQzZGl2dHRuaW0wM29pb2QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE5MzI2MjE4MDMxNjEyMTYzMzAiLCJlbWFpbCI6ImFiZHVsLmFyaWZpbjY3NjdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTcxMzUzNjgxOSwibmFtZSI6ImFiZHVsIGFyaWZpbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKelBBelU3bUlpVVhfbV96Q2VkdXFNOHU2V084QkVNa1ByazFUNVJ1dXFMUFFGOUE9czk2LWMiLCJnaXZlbl9uYW1lIjoiYWJkdWwiLCJmYW1pbHlfbmFtZSI6ImFyaWZpbiIsImlhdCI6MTcxMzUzNzExOSwiZXhwIjoxNzEzNTQwNzE5LCJqdGkiOiJiNzgwZTA4Yjc5NzkzMzY5N2RjYzQ4NTlhZWYxNzkzNzg5ZDRjOWQ0In0.jBDCD-reZm-zGzzdEfuJKGtfx5RnmG3Rysn12ESvczt14QTjahioOB8Qxdptj_jbsd-PiNPHNSrNl8QyXpb8jgxahM4JgMqJzpGpV_Qw2MSpX-A7i_a-fjaBbDPqm0ZSU8PhNy0fc78Nqo6N-dfSRcX91cz6ES9n5IJmVIP5jQLPzopfrSX5zaTmc76OKbpANmdd1PIWTT5ynuVsIycTp9RiaQEGwboMjAFTiw04YS3v80vM30MsqmNlpBU7wDKVUjGYRyqkQad8yS_B0-bUks7D8VCg512nwMISbT4V6l162JOztPuiMSnqQj8cYMyV_RaCwzK7sfHQMd9dbvOtqA",
};
describe.skip("POST /login", () => {
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
