const {Schema,model} = require('mongoose');
const paginate = require("mongoose-paginate-v2");
const joi = require('joi');
const { sign } = require('jsonwebtoken');

const userschema=new Schema({
username:{
    type:String,
    min:5,
    max:50,
    required:true,
    unique:true
},
email:{
    type:String,
    max:250,
    min:11,
    required:true,
    unique:true
},
password:{
    type:String,
    max:1024,
    min:6,
    required:true
},
isAdmin:{
    type: Boolean,
    default:false,
    required:true
}})
userschema.plugin(paginate)

//generating auth token

userschema.methods.generateAuthToken =function() {
    const payload={
     username:this.username,
     email:this.email
    }
    const options={
        expiresIn:"1h"
    }
    return sign(payload,process.env.KEY,options)
}
//joi validation
exports.userValidation=(user)=>{
    const schema=joi.object({
        username:joi.string().min(5).max(50).required(),
        email:joi.string().min(11).max(250).email().required(),
        password:joi.string().min(6).max(50).required(),
        confirmPassword:joi.string().required(),
        isAdmin:joi.required()
    })
    return schema.validate(user)
}
//validating login info
exports.loginValidation=(user)=>{
    const schema=joi.object({
        email:joi.string().required(),
        password:joi.string().required(),
    })
    return schema.validate(user)
}
module.exports.user=model("user",userschema)

