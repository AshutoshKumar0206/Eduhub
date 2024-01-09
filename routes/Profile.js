const express = require('express');
const router = express.Router();

const {getAllUserDetails, updateProfile,deleteProfile, 
    updateDisplayPicture, instructorDashboard, getEnrolledCourses} = require("../controllers/Profile");

const {auth,isInstructor} = require("../middleware/auth");

router.get("/getUserDetails", auth,getAllUserDetails);
router.put("/updateProfile", auth,updateProfile);
router.delete("/deleteProfile", auth,deleteProfile);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/instructorDashboard", auth, instructorDashboard);

module.exports = router;