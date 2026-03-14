import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({

 userId:String,
 ambience:String,
 text:String,
 emotion:String,
 keywords:[String],
 summary:String,
 createdAt:{
  type:Date,
  default:Date.now
 }

});

export default mongoose.model("Journal",journalSchema);