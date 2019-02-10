module.exports = function(descriptionFunction) {
    return async function(req, res, next) {
        if (req.body.meta_request == "describe" || req.params.meta_request == "describe") {
            res.status(200).json(descriptionFunction(req.body.fields));
        } else {
            next();
        }
    }
}