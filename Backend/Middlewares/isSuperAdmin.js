export const isSuperAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.role === 'superAdmin') {
            req.user.isSuperAdmin = true;
            return next();
        }
        if (req.user && req.user.isSuperAdmin === true) {
             return next();
        }
        return res.status(403).json({ message: "Forbidden: Super Admins only" });
    } catch (err) {
        next(err);
    }
};
