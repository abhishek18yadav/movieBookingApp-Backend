import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Theatre'
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Movie'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    timing: {
        type: String,
        required: true
    },
    noOfSeats: {
        type: Number,
        required: true,
    },
    totalCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['processing', 'cancelled', 'successfull', 'expired'],
            message: "Invalid booking status"
        },
        default: 'processing'
    },
    seat: {
        type: String,
    }
}, { timespamps: true });
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;