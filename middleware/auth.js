const User = require("../models/User");
const jwt = require('jsonwebtoken');
require("dotenv").config();

//auth
exports.auth = async (req, res, next) => {
    try{
//extract token
const token  = req.cookies.token || req.body.token ||
                req.header("Authoraization").replace("Bearer ", "");
    
    //if token missing return response
    if(!token){
        return res.status(403).json({
        success:false,
        message:'Token is missing',
        });
    }

    //verify token
    try{
   const decode = await jwt.verify(token, process.env.JWT_SECRET);
   console.log(decode);
   req.user = decode;
    }
    catch(err){
      return res.status(401).json({
     success: false,
     message:'token is invalid',
      });
    }
    next();
    }
    catch(error){
    console.log(error);
    res.status(401).json({
        success: false,
        message:'Something went wrong while validating the token',
    });
    }
}

exports.isStudent = async(req,res,next)=>{
    try{
    if(req.user.accountType !== 'Student'){
    res.status(401).json({
        success:false,
     message:"This is a protected route for Students only",
    });
    }
    next();
    }
    catch(error){
        return res.status(500).json({
success: true,
message: 'User role cannot be verified,Please try again',
        });
    }
}


exports.isInstructor = async(req,res,next)=>{
    try{
    if(req.user.accountType !== 'Instructor'){
    res.status(401).json({
        success:false,
     message:"This is a protected route for Instructors only",
    });
    }
    next();
    }
    catch(error){
        return res.status(500).json({
success: true,
message: 'User role cannot be verified,Please try again',
        });
    }
}


exports.isAdmin = async(req,res,next)=>{
    try{
    if(req.user.accountType !== 'Admin'){
    res.status(401).json({
        success:false,
     message:"This is a protected route for Admin",
    });
    }
    next();
    }
    catch(error){
        return res.status(500).json({
success: true,
message: 'User role cannot be verified,Please try again',
        });
    }
}