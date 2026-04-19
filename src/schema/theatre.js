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
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    movies: [
        {
            name: {
                type: String,
                 
            },
            movieId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Movie',
            },
            price: {
                type: Number,
            },
            status: {
                type: String,
                enum: ['active', 'inactive'],
                default: 'active'
            }
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Theatre = mongoose.model('Theatre', theatreSchema);
export default Theatre;