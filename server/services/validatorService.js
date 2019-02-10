const pool = require('./db.js');

const ValidatorService = {
    // Only validates the provided fields unless "all" is true
    validate: function(object, validations) {
        return new Promise((resolve, reject) => {
            const results = validations.map(function (validation) {
                const validatorResults = new Promise((resolve, reject) => {
                    resolve(validation.validators.map(function (validator) {
                        var result = new Promise((resolve, reject) => {
                            const values = validation.fields.map(function(field) { return object[field]; });
                            const validatorArray = validator.split(":");
                            const validationFunction = validatorArray[0];
                            const validatorArgs = validatorArray.length > 1 ? validatorArray[1].split(",") : [];
                            const args = values.concat(validatorArgs);

                            if (asyncValidators.hasOwnProperty(validationFunction)) {
                                asyncValidators[validationFunction](...args).then((result) => {
                                    resolve({fields: validation.fields, validator: validator, result: result, message: validation.message});
                                });
                            } else if (validators.hasOwnProperty(validationFunction)) {
                                resolve({fields: validation.fields, validator: validator, result:validators[validationFunction](...args), message: validation.message});
                            } else {
                                reject(new Error("Missing validation"));
                            }
                        });

                        return result;
                    }));
                })


                return validatorResults;
            });

            resolvedResults = [];
            allResultPromises = [];
            results.forEach((resultArrayPromise, i) => {
                resultArrayPromise.then((resultArray) => {                    
                    resultArray.forEach((resultPromise, j) => {
                        allResultPromises.push(makeQueryablePromise(resultPromise));

                        resultPromise.then((r) => {
                            resolvedResults.push(r);
                            resolvedResultPromises = allResultPromises.filter((p) => {return !p.isPending(); })

                            if (allResultPromises.length == resolvedResultPromises.length) {
                                const filteredResults = resolvedResults.filter((r) => {return !r.result; })

                                resolve(filteredResults);
                            }
 
                        }).catch((e) => {reject(e)});
                    });
                }).catch((e) => {reject(e)});
            });
        });

        function makeQueryablePromise(promise) {
            // Don't modify any promise that has been already modified.
             if (promise.isResolved) return promise;

             // Set initial state
             var isPending = true;
             var isRejected = false;
             var isFulfilled = false;

             // Observe the promise, saving the fulfillment in a closure scope.
             var result = promise.then(
                 function(v) {
                     isFulfilled = true;
                     isPending = false;
                     return v; 
                 }, 
                 function(e) {
                     isRejected = true;
                     isPending = false;
                     throw e; 
                 }
             );

             result.isFulfilled = function() { return isFulfilled; };
             result.isPending = function() { return isPending; };
             result.isRejected = function() { return isRejected; };
             return result;
        }

        function hasAllFields(result, object) {
            const presentFields = result.fields.filter(function(field) { 
                return object.hasOwnProperty(field); 
            });

            return presentFields.length == result.fields.length
        }
    }

};

const validators = {
    exists: function (value) {
        return !!value; //Placeholder hack - needs to be more explicit
    },
    isEmailFormat: function (value) {
        return !!value && value.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/).length > 0;
    },
    isSecurePass: function (value) {
        return !!value && value.length >= 12;
    },
    matches: function (value1, value2) {
        return !!value1 && !!value2 && value1 == value2;
    }
}

const asyncValidators = {
    isUnique: async function (value, table, field) {
        const result = await pool.query(`SELECT * FROM ${table} WHERE ${field} = $1 LIMIT 1`, [value]);
        return result.rows.length == 0;
    }
}

module.exports = ValidatorService;