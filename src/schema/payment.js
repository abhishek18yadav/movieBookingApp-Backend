import mongoose from "mongoose";
const paymentSchema = mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Booking'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'failed', 'success'],
        default: 'pending'
    },
    method: {
    type: String,
    enum: ["card", "upi", "netbanking", "wallet"],
    default:'upi'
    },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;