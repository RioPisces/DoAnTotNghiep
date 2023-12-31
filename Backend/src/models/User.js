const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name:{type: String},
        email:{type: String,required: true,unique: true},
        password:{type: String,required: true},
        address:{type: String},
        isAdmin:{type: Boolean,default: false,required: true},
        phone:{type: Number},
        avatar:{type: String},
    },
    {
        timestamps: true
    }
);
const User = mongoose.model('User',userSchema);
module.exports = User;