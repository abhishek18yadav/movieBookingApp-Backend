import mongoose from "mongoose";

const showSchema = mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Theatre'
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Movie'
    },
    timming: {
        type: String,
        required:true
    },
    seatConfiguration: {
        type:String,
    },
    price: {
        type: Number,
        required:true
    },
    noOfSeats: {
        type: Number,
        required:true
    },
    format: {
        type:String
    }
}, { timestamps: true });
const Show = mongoose.model('Show', showSchema);
export default Show;