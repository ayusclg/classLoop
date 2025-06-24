class apiResponse extends Error{
     statusCode: number;
    data: Record<string, any>;
    success: boolean;

    constructor(
        statusCode: number,
        data: Record<string, any>,
        message: string = "Successfull",
    )
    {
        super(message);
        this.statusCode = statusCode;
        this.data = data,
            this.success = statusCode < 400
    }
}
export default apiResponse;