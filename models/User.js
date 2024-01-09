const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
// confirmPassword:{
//     type:String,
//     required:true,
// },
accountType:{
type:String,
enum:["Admin", "Student","Instructor"],
required:true,
},
active:{
type:Boolean,
default:true,
},
approved:{
    type:Boolean,
    default:true,
},
additionalDetails:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Profile",
},
Courses:[{
type:mongoose.Schema.Types.ObjectId,
ref:"Courses",
}],
image:{
type:String,
required:true,
},
token:{
type:String,
},
resetPasswordExpires:{
type:Date,
},
courseProgress:[{
type:mongoose.Schema.Types.ObjectId,
ref:"courseProgress",
}],
});

module.exports = mongoose.model("User", userSchema);