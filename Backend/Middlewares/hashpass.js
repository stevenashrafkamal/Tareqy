import bcrypt from "bcrypt";

export const hashPass = async (req,res,next)=>{
    try{
    req.body.password = await bcrypt.hash(req.body.password,8);
    next();
    }catch(err){
        next(err);
    }
}
