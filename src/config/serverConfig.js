import dotenv from "dotenv";
dotenv.config();

export const MONGO_URL = process.env.MONGO_URL;
export const JWT_SECRET = process.env.JWT_SECRET;

export const RAJOR_API_KEY = process.env.RAJOR_API_KEY;
export const RAZOR_API_SECRET = process.env.RAZOR_API_SECRET;