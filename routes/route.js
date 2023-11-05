const express = require("express");
var router = express.Router();
const { validateBody, validateQuery, validateFile, schemas } = require('../helpers/apiValidationHelper');
const multer = require('multer');
var path = require('path');
const authJwt = require("../helpers/middlewares");

var vaultFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd() + '/public/images/'}`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});

var vaultUploads = multer({ storage: vaultFileStorage })// file data uploading path vault files

// importing controller
const userController = require('../controllers/admin/userController');
const categoriesController = require('../controllers/admin/categoriesController');

//user ->signup
router.route('/api/signup')
  .post(vaultUploads.single('profile_image'),
    validateBody(schemas.createUserSchema), userController.signUp);

//signIn
router.route('/api/login')
  .post(userController.login);

//validate otp
router.route('/api/validate/otp')
  .post(userController.validateOtp);


//Categories
{

  //get  list
  router.route('/api/admin/getCats')
    .get(authJwt.verifyToken, categoriesController.getAllCat);

  //create
  router.route('/api/admin/create')
    .post(vaultUploads.single('category_image'), authJwt.verifyToken, validateBody(schemas.createCategorySchema), categoriesController.createCat);

  //update
  router.route('/api/admin/update:id')
    .post(vaultUploads.single('category_image'), authJwt.verifyToken, validateBody(schemas.createCategorySchema), categoriesController.updateCat);

  //update
  router.route('/api/admin/delete:id')
    .post(authJwt.verifyToken, categoriesController.deleteCat);
}

module.exports = router;