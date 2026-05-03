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
    row: String,
    number: Number,
    type: String, // regular / premium / recliner
    status: {
      type: String,
      enum: ["available", "locked", "booked"],
      default: "available"
    }
  }
],
    ticketPrices: {
        regular:  { type: Number, required: true, min: 0 },
        premium:  { type: Number, required: true, min: 0 },
        recliner: { type: Number, required: true, min: 0 }
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