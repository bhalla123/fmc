var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategoriesSchema = new Schema({
    name: {
        type: String,
        deafult: null
    },
    parent_id: {
        type: String,
        deafult: null
    },
    category_image: {
        type: String,
        deafult: null
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    },
}, { timestamps: true });


CategoriesSchema.virtual('category_image_link').get(function () {
    return this.category_image != null ? "http://45.90.108.137:3000/profile/" + this.category_image : "";
});

module.exports = mongoose.model('categories', CategoriesSchema);