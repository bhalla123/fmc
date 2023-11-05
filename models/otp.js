var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OtpSchema = new Schema({   
    otp:{
        type: String,
        deafult: null
    },
    user_id:{
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    },
});


module.exports = mongoose.model('otps', OtpSchema);