const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
//reset password token
exports.resetPasswordToken = async(req,res)=>{
try{
    const {email} = req.body;

    //validate email
    const user = await User.findOne({email: email});
    if(!user){
        return res.json({
            success:false,
           message:"Your Email is not registered"    
        });
    }
    
    //generate token and update user
    const token = crypto.randomUUID();
    
    const updatedDetails = await User.findOneAndUpdate({email: email}, 
                               {
                                 token: token,
                             resetPasswordExpires:Date.now() + 5*60*1000,
                            }, {new:true});
        
    //create url
        const url = `http://localhost:3000/update-password/${token}`;
    
        await mailSender(email, "Password Reset Link", 
        `Password Reset Link:${url} `);
    
    
    return res.json({
        success:true,
        message:"Email sent successfully, please check email and change password",
    });
}
catch(error){
    console.log(error);
return res.status().json({
    success:false,
    message:"Something went wrong while sending reset password mail",
});
}
}


//reset password
exports.resetPassword = async(req,res)=>{
try{
    const {password, confirmPassword, token} = req.body;

if(password !== confirmPassword) {
    return re.json({
        success: true,
        message:"Password and confirm password do not match",
    });
}

const userDetails = await User.findOne({token: token});

if(!userDetails){
    return res.json({
        success: false,
        message:"Token is invalid",
    });
}

//check time for token expiration
if(userDetails.resetPasswordExpires < Date.now()){
    return res.json({
        success: false,
        message:"Token has expired,Please regenerate your token",
    })
}

// hash password
const hashedPassword = await bcrypt.hash(password, 10);

await User.findOneAndUpdate({token:token},
    {password:hashedPassword}, {new:true});

    return res.status(200).json({
        success: true,
        message:"Password reset is successful",
    });
}
    catch(error){
        console.log(error);
return res.status(500).json({
    success: false,
    message:"Something went wrong while reseting password",
});
    }
}