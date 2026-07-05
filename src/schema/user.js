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
        enum: ["super_admin", "theatre_admin", "endUser"],
        default: 'endUser'
    },
    userStatus: {
        type: String,
        enum: ["approved", "pending", "rejected", "blocked"],
        default: "pending"
    },
    
}, { timestamps: true });
userSchema.pre('save', async function () {
    // If password isn't changed, just exit (no next() needed for async)
    if (!this.isModified("password")) return;

    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error(error); // Mongoose will catch this as a validation error
    }
});

userSchema.methods.isValidPassword = async function (plainPassword) {
    const currentUser = this;
    const compare = await bcrypt.compare(plainPassword, currentUser.password);
    return compare;
}
const User = mongoose.model('User', userSchema);
export default User;