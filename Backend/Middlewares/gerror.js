export const gerror = (err,req,res,next)=>{
    console.error("global error",err);
    res.status(err.statusCode || 500).json({message:err.message||"internal server error "})
}
