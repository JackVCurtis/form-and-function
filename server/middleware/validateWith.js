module.exports = function(validationFunction) {
    return async function(req, res, next) {
        const errors = await validationFunction(req.body);

        if (errors.length || Number.parseInt(req.headers.validate)) {
            res.status(400).json(errors);
        } else {
            next();
        }
    }
}