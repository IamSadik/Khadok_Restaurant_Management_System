const isStakeholderLoggedIn = (req, res, next) => {
    if (!req.session.stakeholderId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    next();
};

module.exports = { isStakeholderLoggedIn };
