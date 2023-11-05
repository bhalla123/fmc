var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    mobile_number: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        deafult: null,
    },
    profile_image: {
        type: String,
        deafult: null
    },
    login_type: {
        type: String,
        deafult: 3   //1= admin 2= driver 3=normal user
    },
    role: {
        type: String,
        deafult: "Normal"
    },
    is_verified: {
        type: Number,
        deafult: 0
    },
},
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        },
    });

UserSchema.virtual('profile_image_link').get(function () {
    return this.profile_image != null ? "http://137:3000/profile/" + this.profile_image : "";
});

module.exports = mongoose.model('User', UserSchema);