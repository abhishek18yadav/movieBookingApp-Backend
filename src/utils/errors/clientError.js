import StatusCodes from 'http-status-codes'
class clientError extends Error{
    constructor(error) {
        super(error);
        this.name = 'ClientError',
            this.message = error.message,
            this.StatusCode = error.statusCode ? error.statusCode : StatusCodes.BAD_REQUEST;
        this.explaination = error.explaination;
    };
};
export default clientError;