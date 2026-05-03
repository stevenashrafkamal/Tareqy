import jwt from "jsonwebtoken";

export const GetUserIdFromToken = (req) => {
     const token = req.headers.token;
        const verifed = jwt.verify(token,process.env.SECRET_ACCESS_TOKEN);
        const userId = verifed.id;
        return userId
}
