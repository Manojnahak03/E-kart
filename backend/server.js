import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./Routes/userRoute.js";
import productRoute from "./Routes/productRoute.js";
import orderRoute from "./Routes/orderRoute.js";
import cors from "cors";
import { seedProducts } from "./seed.js";

const app=express(); const PORT=process.env.PORT||3000;
app.use(express.json({limit:"5mb"}));
const allowedOrigins=["http://localhost:5173",process.env.FRONTEND_URL].filter(Boolean);
app.use(cors({origin:(origin,cb)=>{if(!origin||allowedOrigins.includes(origin)) return cb(null,true); cb(new Error("CORS blocked"));},credentials:true}));
app.get("/api/health",(_,res)=>res.json({success:true,message:"ManojMart API is running"}));
app.use("/api/v1/user",userRoute); app.use("/api/v1/products",productRoute); app.use("/api/v1/orders",orderRoute);
app.use((err,_req,res,_next)=>res.status(500).json({success:false,message:err.message||"Server error"}));
app.listen(PORT,async()=>{try{await connectDB();await seedProducts();console.log(`Server is running on port ${PORT}`)}catch(e){console.error("Startup failed:",e.message)}});
