import mongoose from "mongoose";

const connectMongoDB = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGO_URI);
};

export default connectMongoDB;
