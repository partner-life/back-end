const { ObjectId } = require("mongodb");
const Package = require("../model/package");

class PackageController {
  static async getAllPackages(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || Number.MAX_SAFE_INTEGER;
    const search = req.query.search || "";
    const sortByPrice = req.query.sortByPrice || 1;
    const category = req.query.category || "";

    try {
      const packages = await Package.findAllPackages(page, limit, search, sortByPrice, category);
      console.log("🚀 ~ PackageController ~ getAllPackages ~ packages:", packages);
      res.status(200).json({ page, limit, packages });
    } catch (error) {
      next(error);
    }
  }

  static async getPackageById(req, res, next) {
    const packageId = req.params.packageId;
    try {
      if (!packageId) {
        throw { name: "BadRequest", message: "Package ID is required" };
      }
      const packageData = await Package.findPackageById(new ObjectId(packageId));
      if (!packageData) {
        throw { name: "NotFound", message: "Package not found" };
      }
      res.status(200).json(packageData);
    } catch (error) {
      next(error);
    }
  }

  static async createPackage(req, res, next) {
    const { name, imageUrl, description, category, price } = req.body;
    try {
      if (!name || !description || !category || !price) {
        throw { name: "BadRequest", message: "Name, description, category, and price cannot be empty" };
      }
      const newPackage = await Package.createPackage({ name, imageUrl, description, category, price });
      console.log("🚀 ~ PackageController ~ createPackage ~ newPackage:", newPackage);
      res.status(201).json({ name, imageUrl, description, category, price });
    } catch (error) {
      next(error);
    }
  }

  static async deletePackage(req, res, next) {
    const packageId = req.params.packageId;
    try {
      if (!packageId) {
        throw { name: "BadRequest", message: "Package ID is required" };
      }
      const packageData = await Package.findPackageById(new ObjectId(packageId));
      if (!packageData) {
        throw { name: "BadRequest", message: "Package not found" };
      }
      await Package.deletePackage(new ObjectId(packageId));
      res.status(200).json({ message: "Package deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async editPackage(req, res, next) {
    const packageId = req.params.packageId;
    const updatedData = req.body;
    try {
      if (!packageId) {
        throw { name: "BadRequest", message: "Package ID is required" };
      }
      const packageData = await Package.findPackageById(new ObjectId(packageId));
      if (!packageData) {
        throw { name: "BadRequest", message: "Package not found" };
      }

      await Package.editPackage(new ObjectId(packageId), updatedData);
      res.status(200).json({ message: "Package updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async addImages(req, res, next) {
    console.log("🚀 ~ PackageController ~ addImages ~ console:");

    try {
      const cloudinary = require("cloudinary").v2;

      cloudinary.config({
        cloud_name: process.env.CLOUND_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });

      const uploadPromises = req.files.map(async (file) => {
        const mimeType = file.mimetype;
        const data = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${mimeType};base64,${data}`;
        return cloudinary.uploader.upload(dataURI, {
          overwrite: false,
          unique_filename: true,
        });
      });
      console.log("🚀 ~ PackageController ~ uploadPromises ~ uploadPromises:", uploadPromises);

      const results = await Promise.all(uploadPromises);

      const images = results.map((element) => {
        return { imgUrl: element.url };
      });

      console.log("🚀 ~ PackageController ~ images ~ images:", images);
      res.json(images);
      return images;
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = PackageController;
