import bcrypt from 'bcrypt';
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'incorrect format'
        ]
    },
    password: {
        type: String,
        required: [true, 'password required']
    },
    role: {
        type: String,
        required: true,
        enum: ["super_admin", "theatre_admin", "endUser"],
        default: 'endUser'
    },
    userStatus: {
        type: String,
        enum: ["approved", "pending", "rejected", "blocked"],
        default: "pending"
    },
    
}, { timestamps: true });
userSchema.pre('save', async function savePassword(next) {
    if (!this.isModified("password")) return next();
    const user = this;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hassedPassword = await bcrypt.hash(user.password, salt);
    user.password = hassedPassword;
    next();
})
userSchema.methods.isValidPassword = async function (plainPassword) {
    const currentUser = this;
    const compare = await bcrypt.compare(plainPassword, currentUser.password);
    return compare;
}
const User = mongoose.model('User', userSchema);
export default User;