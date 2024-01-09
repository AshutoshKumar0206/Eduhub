const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//send OTP
exports.sendOTP = async (req,res)=>{
try{
    //fetch email from request body
    const {email} = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne({email});

    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message: "User already exists",
        })
    }
    //generate otp
var otp = otpGenerator.generate(6, {
upperCaseAlphabets:false,
lowerCaseAlphabets:false,
specialChars:false,
});


const result = await OTP.findOne({otp:otp});

while(result){
    otp = otpGenerator.generate(6, {
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    const result = await OTP.findOne({otp:otp});
}

const otpPayload = {email, otp};

//create an entry for OTP
const otpBody = await OTP.create(otpPayload);
console.log(otpBody);

//return response successfull
res.status(200).json({
    success:true,
    message:"OTP sent successfully",
    otp,
});
}
catch(error){
console.log(error);
return res.status(500).json({
success:false,
message:error.message,
});
}
}


//signup
exports.signup = async (req,res)=>{
try{
    //fetch data
    const {firstName,
        lastName,
    email,
    password,
    accountType,
    contactNumber,
    otp
    }  = req.body;
    
    //validate data
    if(!firstName || !lastName|| !email || !password ||
           !otp) 
    {
    return res.status(403).json({
        success: true,
        message:"All fields are required",
    });
    
    }
    
    // //match both password
    // if(password !== confirmPassword) {
    //     res.status(400).json({
    //         success:false,
    //         message:"Password do not match, Please try again",
    //     });
    // }
    
    //check if user already exist
    const existingUser = await User.findOne({email:email});
    
    if(existingUser){
        res.status(400).json({
            success:false,
            message:"User is already registered",
        });
    }
    
    //find most recent otp stored for user
    
    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    
    //validate otp
    if(recentOtp.length === 0){
        //OTP not found
        return res.status(400).json({
    success:false,
    message:"OTP not found",
        });
    }else if(otp !== recentOtp[0].otp){
        //invalid OTP
        return res.status(400).json({
            success:false,
            message:"Invalid OTP",
        }); 
    }
    
    
    //Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    
    let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);
    //entry create in DB
    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    })
    
    
    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashPassword,
        accountType:accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    //return res
    return res.status(200).json({
        success: true,
        message:'User is registerd successfully',
        user,
    });
}
catch(error){
console.log(error);
res.status(500).json({
    success: false,
    message:'User cannot be registered, Please try again',
})
}
}


exports.login = async(req,res)=>{
    try{
//get data from req body
const {email, password} = req.body;

//validate data
if(!email || !password){
    return res.status(403).json({
        success: false,
        message: 'All fields are required, Please try again',
    });
}

//check if user exists
const user = await User.findOne({email}).populate("additionalDetails");
if(!user){
    return res.status(200).json({
        success: false,
        message: 'User is not registered, Please SignUp',
    })
}

//generate JWT after password matched
if(await bcrypt.compare(password,user.password)){
const payload = {
email: user.email,
accountType: user.accountType,
id: user._id,
}

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn:"24h",
    });
    user.token = token;
    user.password = undefined;
    
    //create cookie and send response
    const options = {
        expires:new Date(Date.now() + 3*24*60*60*1000),
        httpOnly: true,
    }
    res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message:"User LoggedIn successfully",
    });
}

else{
    res.status(401).json({
success:false,
message:'Password is incorrect',
    });
}
    }
    catch(error){
 console.log(error);
 res.status(500).json({
success:false,
message:'Login failure,Please try again',
 });
    }
}

exports.changePassword = async(req,res)=>{
    try {
    const {password, newPassword} = req.body;
    const userId = req.user.id; // Assuming you have user authentication middleware
  
      // Fetch the user from the database
      const user = await User.findById(userId);
  
      // Check if the old password matches
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({
            success: false, 
            message:'Old password is incorrect' 
        });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
     const updatedPassword = await User.findByIdAndUpdate(userId, { password: hashedPassword }, {new:true});
  
      res.status(200).json({ 
        success: true,
        message: 'Password updated successfully', 
    });

    try {
        const emailResponse = await mailSender(
            updatedUserDetails.email,
            passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
        );
        console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
        });
    }

    // Return success response
    return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
}
    
    catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
    });
    }
}
