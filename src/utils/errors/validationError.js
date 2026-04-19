// import { StatusCodes } from 'http-status-codes'

// class ValidationError extends Error{
//     constructor(errorDetails, message) {
//         super(message);
//         this.name = 'ValidationError';
//         let explaination = [];
//         Object.keys(errorDetails.error).forEach((key) => {
//             explaination.push(errorDetails.error[key]);
//         });
//         this.explaination = explaination;
//         this.message = message;
//         this.StatusCodes = StatusCodes.BAD_REQUEST;
//     }
// }
// export default ValidationError;
import { StatusCodes } from "http-status-codes";

class ValidationError extends Error {
    constructor({ message, errorDetails }) {
        super(message);

        this.name = "ValidationError";
        this.statusCode = StatusCodes.BAD_REQUEST;

        // Support string OR object
        if (typeof errorDetails === "string") {
            this.explanation = [errorDetails];
        } 
        else if (typeof errorDetails === "object" && errorDetails !== null) {
            this.explanation = Object.values(errorDetails);
        } 
        else {
            this.explanation = [];
        }
    }
}

export default ValidationError;