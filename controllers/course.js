const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');

exports.createCourse = async(req,res)=>{
    try{
 const {courseName, courseDescription, whatYouWillLearn, price,category,tag:_tag, status,instructions:_instructions} = req.body;
 const thumbnail = req.files.thumbnailImage;
if(!status || status === undefined){
    status = "Draft";
}
 if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category)
{
    return res.status(400).json({
        success:false,
        message:'All fields are required to be filled',
    })  
}    

const userId = req.user.id;
const instructorDetails = await User.findById(userId,{
    accountType:"Instructor",
});
console.log("Instructor Details", instructorDetails);

if(!instructorDetails){
    return res.status(404).json({
        success:false,
        message:'Instructor details not found',
    });
}

const categoryDetails = await Category.findById(category);
if(!categoryDetails){
    return res.status(404).json({
        success:false,
        message:'Category Details not found',
    });
}
const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

const newCourse = await Course.create({
    courseName,
    courseDescription,
    instructor:instructorDetails._id,
    whatYouWillLearn:whatYouWillLearn,
    price,
    category:categoryDetails._id,
    thumbnail:thumbnailImage.secure_url,
});

await User.findByIdAndUpdate({_id:instructorDetails._id}, {
  $push:{
    courses:newCourse._id,
  }  
},{new:true},)

//update tag schema
await User.findByIdAndUpdate({_id:categoryDetails._id}, 
    {$push:{courseName,courseDescription}},{new:true});

return res.status(200).json({
    success:true,
    message:"Course Created successfully",
    data:newCourse,
});
}
    catch(error){
console.error(error);
res.status(500).json({
    success:false,
    message:"Failed to create course",
    error:error.message,
})
    }
}


exports.showAllCourses = async(req,res)=>{
    try{
   const allCourses = await Course.find({}, {courseName:true,
                                            price:true,
                                        thumbnail:true,
                                     instructor:true,
                                    ratingAndReviews:true,
                                studentsEnrolled:true,})
                                .populate("instructor")
                                .exec();
       return res.status(200).json({
        success:true,
        message:"Data for all courses have been fetched successfully",
       data:allCourses,   
     });                          
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Catch fetch course data",
            error:error.message,
        })
    }
}

exports.getCourseDetails = async(req, res)=>{
    try{
   const {courseId} = req.body;

   const courseDetails = await Course.find({_id:courseId}).populate({
     path:"instructor",
     populate:{
        path:"additionalDetails",
     },
       })
       .populate("category")
    //    .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"SubSection",
            },
        })
        .exec();

        if(!courseDetails){ 
      return res.status(400).json({
        success:true,
        message:`Could not find the course with ${courseId}`,
      });
        }

        return res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            data:courseDetails,
        })
    }
    catch(error){
        console.log(error);
return res.status(500).json({
success:false,
message:error.message,
});
    }
}