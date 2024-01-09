const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");

const database = require("./config/database");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const{cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

database.connect();

app.use(express.json());
app.use(cookieParser());

//to entertain request from frontend
app.use(
    cors({
        origin:`http://localhost:${PORT}`,
        credentials:true,
        
    })
);

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp/",
    })
);

cloudinaryConnect();

//mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.get("/", (req,res)=>{
    return res.json({
        success:true,
        message:"Server is up and running...",
    });
});

app.listen(PORT, ()=>{
    console.log(`App is running at Port ${PORT}`)
});