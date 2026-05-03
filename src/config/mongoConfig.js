import mongoose from "mongoose";

import { MONGO_URL } from "./serverConfig.js";
export async function connectDB() {
    try {
        console.log("connecting ...")
        await mongoose.connect(MONGO_URL);
        console.log(`connected to mongodb`);
        
    } catch (error) {
        console.log("error in connection",error);
    }
}