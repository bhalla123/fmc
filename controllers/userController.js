var mongoose = require('mongoose');
var User = require("../models/user");
var Otp = require("../models/otp");
const JWT = require('jsonwebtoken');
const helperFxn = require('../helpers/hashPasswords');
const responseHelper = require('../helpers/responseHelper');
let bcrypt = require("bcryptjs");
const uid = require('uid');
const fs = require('fs');

signtoken = user => {
  return JWT.sign({
    id: user._id
  }, "fmccskmdnjfnfrnrfjnfrjn");
}


module.exports = {

  signUp: async function (req, res) {
    try {

      let hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        name: req.body.name,
        password: hash,
        mobile_number: req.body.mobile_number,
        email: req.body.email,
        login_type: req.body.login_type,
        role: req.body.role,
        is_verified: 0
      });

      // Match email
      const emailCheck = await User.findOne({
        email: req.body.email,
        role: req.body.role,
        login_type: req.body.login_type
      });

      if (emailCheck) {
        return responseHelper.onError(res, {}, 'Email already exist');
      }

      if (req.file) {
        newUser.profile_image = req.file.filename
      }

      var user = await User.create(newUser);

      if (user) {
        var getUser = await User.findOne({
          _id: user._id
        });

        delete getUser.password;

        return responseHelper.post(res, getUser, 'User Registered');
      } else {
        return responseHelper.onError(res, err, 'Error while registering user');
      }

    } catch (err) {
      console.log({ err })
      return responseHelper.onError(res, err, 'Error while registering user');
    }
  },

  // login
  login: async (req, res) => {
    try {
      const data = req.body;

      // Match email
      const user = await User.findOne({
        email: data.email,
        role: data.role
      });

      if (user) {
        // Match password
        const isMatch = await bcrypt.compareSync(data.password, user.password);
        if (!isMatch) {
          return responseHelper.Error(res, {}, 'Invalid login details')
        }

        const access_token = signtoken(user._id)
        var getUser = await User.findOne({
          _id: user._id
        }, { access_token: access_token }).select({ "name": 1, "_id": 1, "email": 1, "role": 1 })

        delete getUser.password;
        return responseHelper.post(res, getUser, 'Login Successfully !!');
      } else {
        return responseHelper.Error(res, {}, 'Invalid login details')
      }

    } catch (err) {
      return responseHelper.onError(res, err, 'Error while logging In');
    }
  },

  //Validate otp
  validateOtp: async (req, res) => {
    try {
      var otpDetail = await Otp.findOne({
        user_id: user._id,
        otp: req.otp
      });

      if (otpDetail) {
        var userDetail = await User.findOne({
          _id: user._id
        });

        const access_token = await signtoken(userDetail);

        var getUser = await User.findOne({
          _id: user._id
        }, { access_token: access_token }).select({ "name": 1, "_id": 1, "email": 1 })

        return responseHelper.post(res, getUser, 'Otp validate successfully!!');
      }

    } catch (err) {

    }
  },

  getProfileDetail: async function (req, res) {
    try {

      var user_images = await UserImages.find({ user_id: mongoose.Types.ObjectId(req.params.id) });
      var user = await User.findById(req.params.id, { userImages: user_images, avgRating: avgRate, reviews: reviews })
        .select({ "first_name": 1, "_id": 1, "avg_rating": 1, profile_image: 1, "user_name": 1, "email": 1, "interested_in": 1, "gender": 1, "latitude": 1, "longitude": 1, "looking_for": 1, "age_range": 1, "looking_for": 1, "dob": 1, "mobile_number": 1, "bio": 1 });

      return responseHelper.post(res, user, 'Profile detail fetched Successfully');


    } catch (err) {
      console.log(err);
      return responseHelper.onError(res, err, 'Error while getting profile');
    }
  },

  updateProfile: async (req, res) => {
    try {
      var data = req.body;

      var newUser = {
        first_name: req.body.first_name,
        user_name: req.body.user_name,
        gender: req.body.gender,
        dob: req.body.dob,
        interested_in: req.body.interested_in,
        mobile_number: req.body.mobile_number,
        age_range: req.body.age_range,
        email: req.body.email,
        looking_for: req.body.looking_for,
        bio: req.body.bio
      };

      var UserId = data.id;

      // Match email
      const emailCheck = await User.findOne({
        email: req.body.email,
        _id: { $ne: UserId }
      });

      if (emailCheck) {
        return responseHelper.onError(res, {}, 'Email already exist');
      }

      const usernameCheck = await User.findOne({
        user_name: req.body.user_name,
        _id: { $ne: UserId }
      });

      if (usernameCheck) {
        return responseHelper.onError(res, {}, 'Username already exist');
      }

      if (data.password) {
        newUser.password = bcrypt.hashSync(data.password, 10);
      }

      var user = await User.findOneAndUpdate(
        { _id: data.id }
        , newUser,
        { new: true }
      ).lean();

      return responseHelper.post(res, user, 'Profile updated successfully');
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while updating profile');
    }
  },

  updateProfileImage: async (req, res) => {
    try {

      var user = await User.findOne({ _id: req.body.id });

      let imageUrl;

      if (req.file) {
        imageUrl = req.file.filename;

        var filename = imageUrl;
        let previousImagePath = "/var/www/html/seaconnect/public/profile/" + user.profile_image;

        const imageExist = fs.existsSync(previousImagePath);

        if (imageExist) {
          fs.unlink(previousImagePath, (err) => {
            if (err) {
              console.log("Failed to delete image at delete profile");
              return next(err);
            }
          });
        }

      }

      var user = await User.findOneAndUpdate(
        { _id: user._id }
        , { profile_image: filename },
        { new: true }
      ).lean();

      return responseHelper.post(res, user, 'Profile updated successfully');
    } catch (err) {
      return responseHelper.onError(res, err, 'Error while updating image');
    }
  },


  deleteImage: async (imagePath, next) => {
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log("Failed to delete image at delete profile");
        return next(err);
      }
    });
  },

  uploadUserImages: async (req, res) => {
    var files = req.files;

    var data = [];

    //insert new
    var insert = await files.map(item => {
      data.push({
        "user_id": req.user.id,
        "image_path": item.filename
      })
    });

    var resp = await UserImages.insertMany(data);

    return responseHelper.get(res, resp, 'User images fetch successfully.');
  },

  delImage: async (req, res) => {

    var id = req.body.imageId;
    console.log(id);

    var resp = await UserImages.findByIdAndRemove(id);

    return responseHelper.get(res, {}, 'Image deleted successfully!!.');
  },

  logoutUser: async (req, res) => {

    var token = req.body.token;
    JWT.destroy(token)

    // return responseHelper.get(res, {},  'User logout successfully.');
  }
}




