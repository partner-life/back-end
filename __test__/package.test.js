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

  test.skip("should return error if packageId is not provided", async () => {
    const res = await request(app).get("/package/");
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Package ID is required");
  });

  test("should return error if /package/:packageId is not found", async () => {
    const res = await request(app).get("/package/999999999999999999999999");
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Package not found");
  });
});

describe("DELETE /deletepackage/:packageId", () => {
  test("should delete a specific package by ID", async () => {
    const packageId = "888888888888888888888888";
    const res = await request(app).delete(`/deletepackage/${packageId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Package deleted successfully");
  });

  test("should return error if /deletepackage/:packageId is not found", async () => {
    const res = await request(app).delete("/deletepackage/999999999999999999999999");
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Package not found");
  });
});

describe("POST /createpackage", () => {
  test.skip("should create a new package", async () => {
    const newPackageData = {
      name: "New Test Package",
      imageUrl: "newtest.jpg",
      description: "This is a new test package",
      category: "New Category",
      price: 1500,
    };
    const res = await request(app).post("/createpackage").send(newPackageData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(newPackageData);
  });

  test("should return error if name are not provided", async () => {
    const newPackageData = {
      imageUrl: "newtest.jpg",
      description: "This is a new test package",
      category: "New Category",
      price: 1500,
    };
    const res = await request(app).post("/createpackage").send(newPackageData);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Name, description, category, and price cannot be empty");
  });
  test("should return error if category are not provided", async () => {
    const newPackageData = {
      name: "New Test Package",
      imageUrl: "newtest.jpg",
      description: "This is a new test package",
      price: 1500,
    };
    const res = await request(app).post("/createpackage").send(newPackageData);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Name, description, category, and price cannot be empty");
  });
  test("should return error if description are not provided", async () => {
    const newPackageData = {
      name: "New Test Package",
      imageUrl: "newtest.jpg",
      category: "New Category",
      price: 1500,
    };
    const res = await request(app).post("/createpackage").send(newPackageData);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Name, description, category, and price cannot be empty");
  });
  test("should return error if price are not provided", async () => {
    const newPackageData = {
      name: "New Test Package",
      imageUrl: "newtest.jpg",
      description: "This is a new test package",
      category: "New Category",
    };
    const res = await request(app).post("/createpackage").send(newPackageData);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Name, description, category, and price cannot be empty");
  });
});
