import {User} from "../Database/models/user.js"


export const checkSignin = async (req,res,next)=>{
    try{
        const foundEmail = await User.findOne({email:req.body.email})
        if(!foundEmail){
            return res.status(404).json({message:"email is not found "})
        }
        next();
    }catch(err){
        next(err)
    }
}
