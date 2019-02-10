module.exports = function(validationFunction) {
    return async function(req, res, next) {
        if (req.body.meta_request == "validate" || req.params.meta_request == "validate") {
            const errors = await validationFunction(req.body.fields);
            res.status(200).json(errors);
        } else if (req.body.meta_request == undefined) {
            const errors = await validationFunction(req.body);
            if (errors.length) {
                res.status(400).json(errors);
            } else {
                next();
            }
        } else {
            next();
        }
    }
}