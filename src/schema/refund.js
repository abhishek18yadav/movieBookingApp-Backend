import mongoose from 'mongoose';

const refundSchema = mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Booking'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processed', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

const Refund = mongoose.model('Refund', refundSchema);
export default Refund;
