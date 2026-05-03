export const checkAdmin = (req, res, next) => {
    try {
    if (req.user && (req.user.role === "admin" || req.user.role === "superAdmin" || req.user.isSuperAdmin)) {
        return next(); 
    }
    return res.status(403).json({ message: "Forbidden: Admins only" });
    } catch (err) {
        next(err);
    }
};
