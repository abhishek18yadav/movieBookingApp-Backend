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
    seatLayout: [
        {
            row: {
                type: String,
                required: true
            },
            number: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                enum: ["regular", "premium", "recliner"],
                default: "regular"
            }
        }
    ]
})
const Screen = mongoose.model('Screen', screenSchema);
export default Screen;