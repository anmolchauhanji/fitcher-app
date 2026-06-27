class ApiError extends Error {
    constructor(statusCode,message){
        super(message)
        this.statusCode=statusCode,
        this.succes=false

        Error.captureStackTrace(this,this.constructor)
    }
}

export default ApiError