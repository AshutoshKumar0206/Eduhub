const express = require('express');
const router = express.Router();
const {login,signup,sendOTP,changePassword} = require("../controllers/Auth");

const{resetPasswordToken,resetPassword} = require("../controllers/ResetPassword");

const {auth} = require("../middleware/auth");

router.post("/signup", signup);
router.post("/sendotp", sendOTP);
router.post("/login", login);

router.post("/changepassword",auth, changePassword);

router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

module.exports = router;