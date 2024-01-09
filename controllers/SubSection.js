const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

exports.createSubSection = async(req,res)=>{
    try{
const {sectionId,title,timeDuration, description} = req.body;
const video = req.files.video;

if(!sectionId || !title || !timeDuration || !description || !video){
    return res.status(400).json({
        success: false,
        message:"All fields are mandatory to be filled",
    });
}

const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
const subSectionDetails = await SubSection.create({
    title:title,
    timeDuration:timeDuration,
    description:description,
    VideoUrl:uploadDetails.secure_url,
});

const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{
    $push:{
        SubSection:subSectionDetails._id,
    }
},{new:true}).populate("SubSection");

return res.status(200).json({
    success:true,
    message:'SubSection created successfully',
   data: updatedSection,
});
}
    catch(error){
    return res.status(500).json({
        success:false,
        message:"Internal server error occured",
        error:error.message,
    })
    }
}

exports.updateSubSection = async(req,res)=>{
    try{
const {title, subSectionId} = req.body;

if(!title || !subSectionId){
    return res.status(400).json({
        success:false,
        message:"Missing properties",
    });
}

const subSection = await SubSection.findByIdAndUpdate({subSectionId}, {title},{new:true});
return res.status(200).json({
    success:true,
    message:"SubSection created successfully",
})    
}
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in updating SubSection,Please try again",
            error:error.message,
            });
    }
}


exports.deleteSubSection = async(req,res)=>{
    try{
     const {subSectionId} = req.body;

     await SubSection.findByIdAndDelete(subSectionId);
     return res.status(200).json({
        success:true,
       message:"SubSection deleted successfully",
     });
     
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in deleting SubSection,Please try again",
            error:error.message,
            });  
    }
}