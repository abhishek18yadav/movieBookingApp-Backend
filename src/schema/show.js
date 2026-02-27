import mongoose from "mongoose";

const showSchema = mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Theatre'
    },
    screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
    required: true
  },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Movie'
    },
    timming: {
        type: Date,
        required:true
    },
    seatConfiguration: [
    {
      seatNumber: String,
      type: String,
      status: {
        type: String,
        enum: ["available", "locked", "booked"],
        default: "available"
      }
    }
  ],
    price: {
        type: Number,
        required:true
    },
    noOfSeats: {
        type: Number,
        required:true
    },
    format: {
        type: String,
        enum:['2d','3d']
    }
}, { timestamps: true });
const Show = mongoose.model('Show', showSchema);
export default Show;