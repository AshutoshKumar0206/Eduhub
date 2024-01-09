const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/SubSection');

exports.createSection = async(req,res)=>{
    try{
    const{sectionName, courseId} = req.body;
    const newSection = await Section.create({sectionName });

    const updatedCourseDetails = await Course.findByIdAndUpdate(
        courseId,{
         $push:{
            courseContent:newSection._id,
         }
        },
        {new:true},
    ).populate({
        path:"courseContent",
        populate: {
            path:"SubSection"
        },});
   
    return res.status(200).json({
        success:true,
        message:"Section created successfully",
        updatedCourseDetails,
    });
    }
    catch(error){
return res.status(500).json({
success:false,
message:"Error in creating section,Please try again",
error:error.message,
});
    }
}

exports.updateSection = async(req,res)=>{
    try{
const {sectionName, sectionId,courseId} = req.body;

if(!sectionName || !sectionId){
    return res.status(400).json({
        success:false,
        message:"Missing properties",
    });
}

const section = await Section.findByIdAndUpdate(sectionId, {sectionName},{new:true});

const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"SubSection",
			},
		})
		.exec();

return res.status(200).json({
    success:true,
    message:"Section updated successfully",
    
});    
}
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in updating section,Please try again",
            error:error.message,
            });
    }
}

exports.deleteSection = async(req,res)=>{
    try{
     const {sectionId, courseId} = req.body;
 
     await Section.findByIdAndDelete(sectionId);
     return res.status(200).json({
        success:true,
       message:"Section deleted successfully",
     });
     	
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "SubSection"
			}
		})
		.exec();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in deleting section,Please try again",
            error:error.message,
            });  
    }
}