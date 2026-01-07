//import mongoose
import mongoose from "mongoose";

//connect to database which is mongodb;
export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongodb is up");
  } catch (error) {
    console.log("mongodb is down", error);
    process.exit(1);
  }
};
