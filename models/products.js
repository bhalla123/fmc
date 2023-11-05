var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductsSchema = new Schema({
    name: {
        type: String,
        deafult: null
    },
    category_id: {
        type: String,
        deafult: null
    },
    product_image: {
        type: String,
        deafult: null
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: String,
        default: null
    },
    price: {
        type: String,
        default: null
    },
    quantity_type: {
        type: String,
        default: null
    },
    is_out_of_stock: {
        type: Boolean,
        default: false
    }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    },
}, { timestamps: true });


ProductsSchema.virtual('product_image_link').get(function () {
    return this.product_image != null ? "http://45.90.108.137:3000/profile/" + this.product_image : "";
});

module.exports = mongoose.model('categories', ProductsSchema);