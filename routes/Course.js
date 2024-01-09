const express = require('express');
const router = express.Router();

const{createCourse,showAllCourses,getCourseDetails} = require("../controllers/course");
const {createCategory,showAllCategory,categoryPageDetails} = require("../controllers/category");
const {createSection,updateSection,deleteSection} = require("../controllers/Section");
const {createSubSection,updateSubSection,deleteSubSection} = require("../controllers/SubSection");
const {createRating,getAverageRating,getAllRating} = require("../controllers/RatingAndReview");
const {auth, isInstructor, isStudent, isAdmin} = require("../middleware/auth");

router.post("/createCourse", auth,isInstructor,createCourse);
router.post("/createSection", auth,isInstructor,createSection);
router.post("/updateSection", auth,isInstructor,updateSection);
router.post("/deleteSection", auth,isInstructor,deleteSection);
router.post("/createSubSection", auth,isInstructor,createSubSection);
router.post("/updateSubSection", auth,isInstructor,updateSubSection);
router.post("/deleteSubSection", auth,isInstructor,deleteSubSection);

router.get("/showAllCourses", showAllCourses);
router.post("/getCourseDetails", getCourseDetails);

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategory", showAllCategory);
router.post("/getcategoryPageDetails", categoryPageDetails);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating)

module.exports = router;