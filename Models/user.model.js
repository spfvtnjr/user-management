const {Schema,model} = require('mongoose');
const joi = require('joi');
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
}})

//joi validation
exports.userValidation=(user)=>{
    const schema=joi.object({
        username:joi.string().min(5).max(50).required(),
        email:joi.string().min(11).max(250).email().require(),
        password:joi.string().min(6).max(50).require(),
        confirmPassword:joi.string().required()
    })
    return joi.validate(user,schema)
}
module.exports.user=model("user",userschema)


