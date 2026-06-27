const asynchandler = async (handler)=> {
    return(req,res,next)=>{
        Promise.resolve(handler(req,res,next)).catch(next)
    }
}

export default asynchandler