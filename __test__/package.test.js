const request = require("supertest");
const { ObjectId } = require("mongodb");
const database = require("../config/db");
const app = require("../app");
const Package = require("../model/package");
const { signToken } = require("../helper/jwt");
const fs = require("fs");
const path = require("path");
const filePath = path.resolve(__dirname, "./60x40-Image-Test.png");
const image = fs.createReadStream(filePath);
const image2 = fs.createReadStream(filePath);

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
    const res = await request(app).get("/package/888888888888888888888888");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("imageUrl");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("category");
    expect(res.body).toHaveProperty("price");
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

describe("PATCH /add-images/:packageId", () => {
  // test("should return error if no Authorization provided", async () => {
  //   const res = await request(app).patch("/add-images/6623cbee845cecc6a97b47d4");
  //   expect(res.statusCode).toEqual(401);
  //   expect(res.body.message).toEqual("Authorization Token is missing");
  // });

  // test("should add a new test if not admin", async () => {
  //   const res = await request(app)
  //     .patch("/add-images/888888888888888888888888")
  //     .set("Authorization", "Bearer " + access_tokenUser);

  //   expect(res.statusCode).toEqual(401);
  //   expect(res.body.message).toEqual("You are not authorized to access this page");
  // });

  test("should upload images to a specific package by ID", async () => {
    const res = await request(app)
      // .patch("/add-images/888888888888888888888888")
      // .set("Authorization", "Bearer " + access_tokenAdmin)
      .patch("/add-images")
      .attach("images", image, "Image-Test-1.png")
      .attach("images", image, "Image-Test-2.png");

    expect(res.body.message).toEqual("Images uploaded successfully");
    expect(res.statusCode).toEqual(200);
  });

  test("should add a new test if no images are uploaded", async () => {
    const res = await request(app).patch("/add-images");
    expect(res.body.message).toEqual("Files are required");
    expect(res.statusCode).toEqual(400);
  });

  // test("should add a new test if package is not found", async () => {
  //   const res = await request(app)
  //     .patch("/add-images/999999999999999999999999")
  //     .set("Authorization", "Bearer " + access_tokenAdmin)
  //     .attach("images", image2, "Image-Test.png");

  //   expect(res.statusCode).toEqual(404);
  //   expect(res.body.message).toEqual("Package not found");
  // });
});

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
  test("should add a new test if no Authorization provided", async () => {
    const res = await request(app).post("/createpackage").send({}).set("Authorization", "");
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Authorization Token is missing");
  });

  test("should add a new test if not an admin", async () => {
    const res = await request(app)
      .post("/createpackage")
      .send({})
      .set("Authorization", "Bearer " + access_tokenUser);
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("You are not authorized to access this page");
  });

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
