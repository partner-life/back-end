const request = require("supertest");
const app = require("../app");
const database = require("../config/db");
const { ObjectId } = require("mongodb");
const Package = require("../model/package");

beforeAll(async () => {
  const packageData = {
    _id: new ObjectId("888888888888888888888888"),
    name: "Test name",
    imageUrl: "test.jpg",
    description: "This is a npm test",
    category: "Sample Category",
    price: 1000,
  };
  await Package.createPackage(packageData);
});

afterAll(async () => {
  const packageId = new ObjectId("888888888888888888888888");
  await Package.deletePackage(packageId);
  console.log("done");
});

describe("GET /package", () => {
  test("should get all packages", async () => {
    const res = await request(app).get("/package");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("packages");
  });
});

describe("GET /package/:packageId", () => {
  test("should get a specific package by ID", async () => {
    const packageId = "888888888888888888888888";
    const res = await request(app).get(`/package/${packageId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("imageUrl");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("category");
    expect(res.body).toHaveProperty("price");
  });

  test("should return error if /package/:packageId is not found", async () => {
    const res = await request(app).get("/package/999999999999999999999999");
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Package not found");
  });
});
