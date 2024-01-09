const {default:mongoose} = require("mongoose");
const Category = require('../models/Category');

//Category handler

exports.createCategory = async(req,res)=>{
    try{
   const {name,description} = req.body;

   if(!name || !description){
    return res.status(400).json({
        success:false,
        message:'All fields are required to be filled',
    });
   }

   const CategoryDetails = await Category.create({
    name:name,
    description:description,
   });

   console.log(CategoryDetails);

   return res.status(200).json({
    success:true,
    message:"Category created successfully",
   });
    }
    catch(error){
return res.status(500).json({
    success:false,
    message:error.message,
})
    }
}


exports.showAllCategory = async(req,res)=>{
    try{
const allCategory = await Category.find({}, {name:true, description:true});
res.status(200).json({
    success:true,
    message:"All Categories returned successfully",
    data:allCategory,
});
    }
    catch(error){
return res.status(500).json({
    success:false,
    message:error.message,
})
    }
}


exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "Course",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        })
        .exec()
  
      // Handle the case when the category is not found
      if (!selectedCategory) {
        return res.status(404).json({
           success: false, 
           message: "Category not found" 
          })
      }
      // Handle the case when there are no courses
      if (selectedCategory.Course.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "Course",
          match: { status: "Published" },
        })
        .exec()
      
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "Course",
          match: { status: "Published" },
          populate: {
            path: "Instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
    
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }