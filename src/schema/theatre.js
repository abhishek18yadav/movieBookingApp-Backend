import mongoose from "mongoose"
const theatreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength:5
    },
    city: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    movies: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Movie'
    }
}, { timestamps: true });

const Theatre = mongoose.model('Theatre', theatreSchema);
export default Theatre;