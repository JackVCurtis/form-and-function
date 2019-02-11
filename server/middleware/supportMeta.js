const ValidatorService = require('../services/validatorService');

module.exports = function (metadata) {
    return async function (req, res, next){
       if (req.body.meta_request == "describe" || req.params.meta_request == "describe") {
           res.status(200).json(metadata);
       } else if (req.body.meta_request == "validate" || req.params.meta_request == "validate") {
            try {
               const validations = await ValidatorService.validate(req.body.fields, metadata.validations);
               res.status(200).json(validations); 
            } catch (e) {
                console.log(e);
                res.status(400).json(e);
            }
       } else if (req.body.meta_request == undefined) {
           const validations = await ValidatorService.validate(req.body, metadata.validations);
           const errors = validations.filter((validation) => !validation.result)
           if (errors.length) {
               res.status(400).json(errors);
           } else {
               next();
           }
       } else if (req.body.meta_request || req.params.meta_request) {
           return res.status(400).json({error: "Unsupported meta_request value"});
       } else {
           next();
       } 
   }
}