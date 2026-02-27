import mongoose from "mongoose"
const screenSchema = mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre',
        required:true
    },
    name: {
        type: String,
        required:true
    },
    totalSeats: {
        type: Number,
        required:true
    },
    seatLayout: {
        row: String,
        number: Number,
        type: {
            type: String,
            enum: ["regular", "premium", "recliner"]
        }
    }
})