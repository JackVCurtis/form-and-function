import axios from "axios";

const syncValidators = require('../../../shared/syncValidators.js');

const ValidatorService = {
    validate: async function(object, validations, endpoint) {
        const hasAsyncValidations = validations
            .flatMap((validation) => { return validation.validators; })
            .filter((validator) => { return !validators.hasOwnProperty(validator.split(":")[0])});

        var results;
        
        if (hasAsyncValidations.length) {
            const callParams = endpoint.split(" ");
            try {
                const res = await axios({
                    method: callParams[0],
                    url: callParams[1],
                    data: {
                        meta_request: "validate",
                        fields: object
                    }
                });

                results = res.data;
            } catch (e) {
                
            }
        } else {
            results = new Promise((resolve, reject) => {
                const syncResults = validations.flatMap((validation) => {
                    return validation.validators.map((validator) => {
                        const values = validation.fields.map(function(field) { return object[field]; });
                        const validatorArray = validator.split(":");
                        const validationFunction = validatorArray[0];
                        const validatorArgs = validatorArray.length > 1 ? validatorArray[1].split(",") : [];
                        const args = values.concat(validatorArgs);

                        if (validators.hasOwnProperty(validationFunction)) {
                            return {fields: validation.fields, validator: validator, result:validators[validationFunction](...args), message: validation.message};
                        } else {
                            reject(new Error("Missing validation"));
                        }
                    });
                });

                resolve(syncResults);
            });
        }

        return results;
    }
};

const validators = syncValidators;

export default ValidatorService;