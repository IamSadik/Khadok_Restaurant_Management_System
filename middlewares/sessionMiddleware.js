// middleware/sessionMiddleware.js
module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user; // Make session data globally available
    } else {
        res.locals.user = null; // No session user
    }
    next();
};
