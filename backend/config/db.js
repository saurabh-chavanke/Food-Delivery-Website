import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://saurabhchavanke:Saurabh1611@cluster0.o58uz.mongodb.net/food-del').then(()=>console.log("Db connected"))
}