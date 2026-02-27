import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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
        default: endUser
    },
    userStatus: {
        type: String,
        enum: ["approved", "pending", "rejected", "blocked"],
        default: "pending"
    },
    theatreId: {
        
    }
}, { timestamps: true });
userSchema.pre('save', function savePassword(next) {
    const user = this;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hassedPassword = bcrypt.hash(user.password, salt);
    user.password = hassedPassword;
    next();
})

const User = mongoose.model('User', userSchema);
export default User;