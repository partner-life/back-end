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
    const { name, imageUrl, description, category, price } = req.body;
    // console.log("🚀 ~ PackageController ~ editPackage ~ updatedData:", { packageId, name, imageUrl, description, category, price });
    try {
      if (!packageId) {
        throw { name: "BadRequest", message: "Package ID is required" };
      }
      const packageData = await Package.findPackageById(new ObjectId(packageId));
      if (!packageData) {
        throw { name: "BadRequest", message: "Package not found" };
      }

      await Package.editPackage(new ObjectId(packageId), { name, imageUrl, description, category, price });
      res.status(200).json({ message: "Package updated successfully" });
    } catch (error) {
      next(error);
    }
  }
  static async addImages(req, res, next) {
    const { packageId } = req.body;
    const packageData = await Package.findPackageById(new ObjectId(packageId));

    if (!packageData) {
      throw { name: "BadRequest", message: "Package not found" };
    }

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

      const results = await Promise.all(uploadPromises);

      const images = results.map((element) => {
        return { _id: new ObjectId(), imgUrl: element.url };
      });

      const data = await Package.editPackageImage(new ObjectId(packageId), images);

      if (data.modifiedCount > 0) {
        res.status(200).json({ message: "Data modified successfully", images });
      } else {
        res.status(200).json({ message: "No data modified" });
      }

      return images;
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PackageController;
