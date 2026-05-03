import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Middleware: allows access only to users with role 'codeReviewer', 'admin', or 'superAdmin'.
 */
export const checkCodeReviewer = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        const token = req.headers.token || bearerToken;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Please login" });
        }

        const verified = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
        req.user = { ...verified, _id: verified._id || verified.id };

        const allowedRoles = ['codeReviewer', 'admin', 'superAdmin'];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Code Reviewer access only" });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
