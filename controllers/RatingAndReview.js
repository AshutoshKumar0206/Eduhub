const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating = async(req,res)=>{
    try{
     const userId = req.user.id;
     const {rating,review,courseId} = req.body;
    
     const courseDetails = await Course.findOne({_id:courseId, 
        studentsEnrolled:{$elemMatch:{$eq:userId}}});
  
    if(!courseDetails){
        return res.status(404).json({
            success:false,
            message:"Student is not enrolled in the course",
        });
    }

    const alreadyReviewed = await RatingAndReview.findOne({
        user:userId,
        Course:courseId,
    });

    if(alreadyReviewed){   

        return res.status(403).json({
            success:false,
            message:"Course is already reviewed by the User",
        });
    }

const ratingReview = await RatingAndReview.create({
    rating,review,Course:courseId,user:userId,
});

const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},{
$push:{
    RatingAndReview:ratingReview._id,
}
}, {new:true});

console.log(updatedCoursesDetails);

return res.status(200).json({
    success:true,
    message:"Rating and Review created successfully",
    ratingReview,
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


exports.getAverageRating = async(req,res)=>{
    try{
   const courseId = req.body.courseId;

   const result = await RatingAndReview.aggregate([
    {
        $match:{
            course:new mongoose.Types.ObjectId(courseId),
        },
    },
    {
$group:{
    _id:null,
averageRating:{$avg:"$rating"},
}
    },
   ])

   if(result.length > 0){
    return res.status(200).json({
        success:true,
        averageRating:result[0].averageRating,    
    })
   }

   return res.status(200).json({
    success:true,
    averageRating:0,
message:'Average Rating is 0,no rating is given to the course till now',    
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


exports.getAllRating = async(req,res)=>{
    try{
const allReviews = await RatingAndReview.find({})
                                  .sort({rating:"desc"})
                                   .populate({path:"user",
                                select:"frstName lastName image email",
                                   }
                                   ).populate({
                                    path:"course",
                                    select:"courseName",
                                   }).exec(); 
    
                                   
    return res.status(200).json({
        success:true,
        message:"All Reviews fetched successfully",
        data:allReviews,
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