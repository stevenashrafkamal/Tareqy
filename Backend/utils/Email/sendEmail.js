import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { template } from "./email.template.js";

export const sendEmail= async (email)=>{
    const transport = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
    })
    const tokens =jwt.sign({email},process.env.SECRET_EMAIL_TOKEN,{expiresIn:"1d"})
    const frontEndBaseUrl = process.env.FRONTEND_URL || "http://localhost:4200";
    const info  = await transport.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"confirem email",
        html:template(tokens, frontEndBaseUrl)
    })
    console.log(info.response)

}
