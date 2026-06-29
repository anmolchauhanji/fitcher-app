export  const successResponse = (
    res,
    statusCode=200,
    message="success",
    data=null
)=>{
    return res.status(statusCode).json({
        success:true,
        message,
        data
    })
}


export const failedResponse = (
    res,
    statusCode=500,
    message="Something went wrong",
    errors=null
)=>{
return res.status(statusCode).json({
success:false,
message,
errors
})
}