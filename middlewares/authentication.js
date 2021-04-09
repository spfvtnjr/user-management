const { verify } = require("jsonwebtoken")
const { formatResult } = require("../../first-app-backend/utils/imports")


exports.auth = async (req,res,next)=>{
const header=req.header("authorization")
if (header) {
    const token=header.split(' ')[1]
    if(!token)
        return res.send(formatResult({status:401, message:'No token found'}))
    else{
        try {
            const decoded=verify(token,process.env.KEY)
            req.user=decoded
            next()
        } catch (error) {
            res.send(formatResult({
                status:401,
                message:"Invalid token"
            }))
        }
    }    
}
else{
    res.send(formatResult({
        status:401,
        message:"no token found"
    }))
}
}