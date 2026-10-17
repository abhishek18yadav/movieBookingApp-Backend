import {  z} from "zod";

export const userSigninSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string()
});

export const userSignupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string(),
    username: z.string().min(3, { message: "Username must be at least 3 characters long" })
})