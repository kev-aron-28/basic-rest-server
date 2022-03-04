const validate_file = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json({ msg: "No files" });
        return;
    }
    next();
}

module.exports = {
    validate_file
};