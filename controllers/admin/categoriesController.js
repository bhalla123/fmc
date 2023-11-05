var mongoose = require('mongoose');
var Category = require("../../models/categories");
const responseHelper = require('../../helpers/responseHelper');
const fs = require('fs');

module.exports = {

    createCat: async (req, res) => {
        try {
            let catName = req.body.name.toLowerCase();

            const newRecord = new Category({
                name: catName,
                parent_id: req.body.parent_id,
                user_id: req.userId
            });

            // Match name
            const nameCheck = await Category.findOne({
                name: catName
            });

            if (nameCheck) {
                return responseHelper.onError(res, {}, 'Category already exist');
            }

            if (req.file) {
                newRecord.category_image = req.file.filename
            }

            var record = await Category.create(newRecord);

            return responseHelper.post(res, record, 'Record Created Successfully!!');

        } catch (err) {
            console.log({ err })
            return responseHelper.onError(res, err, 'Error while creating category');
        }
    },

    updateCat: async (req, res) => {
        try {
            var data = req.body;
            let catName = data.name.toLowerCase();

            // Match name
            const nameCheck = await Category.findOne({
                name: catName
            });

            if (nameCheck && nameCheck._id != req.user._id) {
                return responseHelper.onError(res, {}, 'Category already exist');
            }

            let upRecord = {
                name: catName,
                parent_id: data.parent_id
            }

            if (req.file) {
                upRecord.category_image = req.file.filename
            }

            var record = await Category.findOneAndUpdate(
                { _id: data.id }
                , {
                    $set: upRecord,
                },
                { new: true }
            ).lean();

            return responseHelper.post(res, record, 'Category updated successfully');
        } catch (err) {
            return responseHelper.onError(res, err, 'Error while updating category');
        }
    },

    getAllCat: async (req, res) => {
        try {
            let allCat = await Category.find();
            return responseHelper.post(res, allCat, 'Category list fetched successfully');
        } catch (error) {
            console.log(error);
            return res.status(500).json({ "error": error, msg: "Sorry, something went wrong" });
        }
    },

    deleteCat: async (req, res) => {
        try {

            let data = req.body;
            var record = await Category.findOneAndUpdate(
                { _id: data.id }
                , {
                    $set: {
                        is_active: true
                    },
                },
                { new: true }
            ).lean();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ "error": error, msg: "Sorry, something went wrong" });
        }
    }
}




