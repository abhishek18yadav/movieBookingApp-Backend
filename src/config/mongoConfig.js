import mongoose from "mongoose";

import { MONGO_URL } from "./serverConfig.js";
export async function connectDB() {
    try {
        console.log("connecting ...")
        await mongoose.connect(MONGO_URL);
        
    } catch (error) {
        console.log("error in connection",error);
    }
}