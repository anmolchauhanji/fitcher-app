export  const successResponse = (
    res,
    data=null,
    message="success",
    statusCode=200
)=>{
    return res.status(statusCode).json({
        success:true,
        message,
        data
    })
}


export const failedresponse = (
    res,
    errors=null,
    message="Something went wrong",
    statuscode=500
)=>{
return res.status(statuscode).json({
success:false,
message,
errors
})
}