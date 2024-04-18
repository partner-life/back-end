const Profle = require("../model/profile");

class ProfileController {
   static async createProfile(req, res, next) {
      try {
         const UserId = req.user._id;
         const { address, phoneNumber } = req.body;
         if (address.length === 0) throw { name: "BadRequest", message: "address is required" };
         if (phoneNumber.length === 0) throw { name: "BadRequest", message: "Phone Number is required" };
         if (!Number(phoneNumber)) throw { name: "BadRequest", message: "Phone Number must be NUMBER" };
         if (phoneNumber.length <= 15)
            throw {
               name: "BadRequest",
               message: "Phone Number must less then 15 character",
            };
         await Profle.createProfile(UserId, phoneNumber, address);
         res.status(201).json({ message: "profil has been succes to create" });
      } catch (error) {
         next(error);
      }
   }
   static async findAll(req, res, next) {
      try {
         const result = await Profle.findAll();
         res.status(200).json(result);
      } catch (error) {
         next(error);
      }
   }
   static async findById(req, res, next) {
      try {
         const id = req.user._id;
         const result = await Profle.findById(id);

         res.status(200).json(result);
      } catch (error) {
         next(error);
      }
   }
}
module.exports = ProfileController;
