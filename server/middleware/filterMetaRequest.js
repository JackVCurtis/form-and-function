module.exports = function (req, res, next) {
    if (req.body.meta_request || req.params.meta_request) {
        return res.status(400).json({error: "Unsupported meta_request value"});
    } else {
        next();
    }
}