const express = require("express");
const router = express.Router();
const {capturePayment,verifySignature} = require("../controllers/Payments");
const {auth, isStudent, isAdmin, isInstructor} = require("../middleware/auth");

router.post("/capturePayment",auth, isStudent, capturePayment);
router.get("/verifySignature", auth, isStudent, verifySignature);


module.exports = router;