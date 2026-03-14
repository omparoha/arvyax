import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import journalRoutes from "./routes/journalRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

app.use("/api/journal", journalRoutes);

app.listen(process.env.PORT,()=>{
 console.log("Server running on port "+process.env.PORT);
});