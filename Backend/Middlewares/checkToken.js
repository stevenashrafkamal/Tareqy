import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const checkToken = (req,res,next)=>{
    try{
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const token = req.headers.token || bearerToken;
    if(!token){
    return res.status(401).json({ message: "Unauthorized: Please login" });
    }
    const verifed = jwt.verify(token,process.env.SECRET_ACCESS_TOKEN);
    req.user = {
      ...verifed,
      _id: verifed._id || verifed.id
    };
    next();
} catch (err) {
    return res.status(401).json({ message: "Invalid token" });
}}
