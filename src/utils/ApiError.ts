class apiError extends Error{
    statusCode: number;
    stack?: string | undefined;
    success: boolean;


    constructor(
        statusCode: number,
        message: string = "something went wrong",
        stack: string | undefined = ""
    )
     { 
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        (stack) ? this.stack = stack : Error.captureStackTrace(this, this.constructor)
    }
}

export default apiError;