const request = require("supertest");
const { ObjectId } = require("mongodb");
const database = require("../config/db");
const app = require("../app");
const Package = require("../model/package");
const { signToken } = require("../helper/jwt");

let access_tokenAdmin;
let access_tokenUser;

beforeAll(async () => {
  const packageData = {
    _id: new ObjectId("888888888888888888888888"),
    name: "Test name",
    imageUrl: "test.jpg",
    description: "This is a npm test",
    category: "Sample Category",
    price: 1000,
  };
  const data = await Package.createPackage(packageData);
  console.log("🚀 ~ beforeAll ~ data:", data);

  let dataAdmin = {
    email: "admin@mail.com",
    password: "12345",
  };
  const loginAdmin = await database.collection("Users").findOne({ email: dataAdmin.email });
  access_tokenAdmin = signToken({ id: loginAdmin._id });
  let dataUser = {
    email: "user@mail.com",
    password: "12345",
  };
  const loginUser = await database.collection("Users").findOne({ email: dataUser.email });
  access_tokenUser = signToken({ id: loginUser._id });
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
    const res = await request(app)
      .get(`/package/${packageId}`)
      .set("Authorization", "Bearer " + access_tokenUser);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("imageUrl");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("category");
    expect(res.body).toHaveProperty("price");
  });

  test("should return error if /package/:packageId is not found", async () => {
    const res = await request(app)
      .get("/package/999999999999999999999999")
      .set("Authorization", "Bearer " + access_tokenUser);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Package not found");
  });

  test("should return error if no Authorization provided", async () => {
    const res = await request(app).get("/package/999999999999999999999999");
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Authorization Token is missing");
  });
});

describe("PUT /editpackage/:packageId", () => {
  test("should edit a specific package by ID", async () => {
    const packageId = "888888888888888888888888";
    const updatedPackageData = {
      name: "Updated Test Package",
      imageUrl: "updatedtest.jpg",
      description: "This is an updated test package",
      category: "Updated Category",
      price: 2000,
    };
    const res = await request(app)
      .put(`/editpackage/${packageId}`)
      .send(updatedPackageData)
      .set("Authorization", "Bearer " + access_tokenAdmin);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Package updated successfully");
  });

  test("should return error if /editpackage/:packageId is not found", async () => {
    const res = await request(app)
      .put("/editpackage/999999999999999999999999")
      .send({})
      .set("Authorization", "Bearer " + access_tokenAdmin);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Package not found");
  });

  test("should return error if no Authorization provided", async () => {
    const res = await request(app).put("/editpackage/999999999999999999999999").send({});
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Authorization Token is missing");
  });

  test("should return error if user is not admin", async () => {
    const res = await request(app)
      .put("/editpackage/999999999999999999999999")
      .send({})
      .set("Authorization", "Bearer " + access_tokenUser);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("You are not authorized to access this page");
  });
});

// // describe("POST /add-images", () => {
// //   test("should add images to a specific package", async () => {
// //     const packageId = "888888888888888888888888";
// //     const imageFiles = [
// //       { mimetype: "image/jpeg", buffer: Buffer.from("image1") },
// //       { mimetype: "image/png", buffer: Buffer.from("image2") },
// //     ];
// //     const res = await request(app).patch("/add-images").send({ packageId, images: imageFiles });
// //     expect(res.statusCode).toEqual(200);
// //     expect(res.body.message).toEqual("Images added successfully");
// //   });

// //   test("should return error if packageId is not provided", async () => {
// //     const imageFiles = [
// //       { mimetype: "image/jpeg", buffer: Buffer.from("image1") },
// //       { mimetype: "image/png", buffer: Buffer.from("image2") },
// //     ];
// //     const res = await request(app).patch("/add-images").send({ images: imageFiles });
// //     expect(res.statusCode).toEqual(400);
// //     expect(res.body.message).toEqual("Package ID is required");
// //   });

// //   test("should return error if images are not provided", async () => {
// //     const packageId = "888888888888888888888888";
// //     const res = await request(app).patch("/add-images").send({ packageId });
// //     expect(res.statusCode).toEqual(400);
// //     expect(res.body.message).toEqual("Images are required");
// //   });
// // });

describe("DELETE /deletepackage/:packageId", () => {
  test("should return error if no Authorization provided", async () => {
    const res = await request(app).delete("/deletepackage/999999999999999999999999").send({});
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Authorization Token is missing");
  });
  test("should return error if user is not admin when deleting a package", async () => {
    const res = await request(app)
      .delete("/deletepackage/888888888888888888888888")
      .set("Authorization", "Bearer " + access_tokenUser);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("You are not authorized to access this page");
  });

  test("should delete a specific package by ID", async () => {
    const packageId = "888888888888888888888888";
    const res = await request(app)
      .delete(`/deletepackage/${packageId}`)
      .set("Authorization", "Bearer " + access_tokenAdmin);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Package deleted successfully");
  });

  test("should return error if /deletepackage/:packageId is not found", async () => {
    const res = await request(app)
      .delete("/deletepackage/999999999999999999999999")
      .set("Authorization", "Bearer " + access_tokenAdmin);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Package not found");
  });
});

describe("POST /createpackage", () => {
  test("should create a new package", async () => {
    const newPackageData = {
      name: "New Test Package",
      imageUrl: "newtest.jpg",
      description: "This is a new test package",
      category: "New Category",
      price: 1500,
    };
    const res = await request(app)
      .post("/createpackage")
      .send(newPackageData)
      .set("Authorization", "Bearer " + access_tokenAdmin);
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
    const res = await request(app)
      .post("/createpackage")
      .send(newPackageData)
      .set("Authorization", "Bearer " + access_tokenAdmin);
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
    const res = await request(app)
      .post("/createpackage")
      .send(newPackageData)
      .set("Authorization", "Bearer " + access_tokenAdmin);
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
    const res = await request(app)
      .post("/createpackage")
      .send(newPackageData)
      .set("Authorization", "Bearer " + access_tokenAdmin);
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
    const res = await request(app)
      .post("/createpackage")
      .send(newPackageData)
      .set("Authorization", "Bearer " + access_tokenAdmin);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Name, description, category, and price cannot be empty");
  });
});
