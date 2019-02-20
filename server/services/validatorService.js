const pool = require('./db.js');
const syncValidators = require('../../shared/syncValidators');
const ValidatorService = {
    validate: function(object, validations) {
        return new Promise((resolve, reject) => {
            const results = validations.map(function (validation) {
                const validatorResults = new Promise((resolve, reject) => {
                    resolve(validation.validators.map(function (validator, i) {
                        var result = new Promise((resolve, reject) => {
                            const values = validation.fields.map(function(field) { return object[field]; });
                            const validatorArray = validator.split(":");
                            const validationFunction = validatorArray[0];
                            const validatorArgs = (validatorArray.length > 1 ? validatorArray[1].split(",") : [])
                                .map((arg) => { return arg.match(/^\$/) ? object[arg.match(/(?<=\$)[\w]+/)[0]] : arg});
                            const args = values.concat(validatorArgs);

                            if (asyncValidators.hasOwnProperty(validationFunction)) {
                                asyncValidators[validationFunction](...args).then((result) => {
                                    resolve({fields: validation.fields, validator: validator, result: result, message: validation.messages[i]});
                                });
                            } else if (validators.hasOwnProperty(validationFunction)) {
                                resolve({fields: validation.fields, validator: validator, result:validators[validationFunction](...args), message: validation.messages[i]});
                            } else {
                                reject(new Error("Missing validation"));
                            }
                        });

                        return result;
                    }));
                })


                return validatorResults;
            });

            const resolvedResults = [];
            const allResultPromises = [];
            results.forEach((resultArrayPromise, i) => {
                resultArrayPromise.then((resultArray) => {                    
                    resultArray.forEach((resultPromise, j) => {
                        allResultPromises.push(makeQueryablePromise(resultPromise));

                        resultPromise.then((r) => {
                            resolvedResults.push(r);
                            const resolvedResultPromises = allResultPromises.filter((p) => {return !p.isPending(); })

                            if (allResultPromises.length == resolvedResultPromises.length) {
                                resolve(resolvedResults);
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
    }

};

const validators = syncValidators;

const asyncValidators = {
    isUnique: async function (value, table, field) {
        const result = await pool.query(`SELECT * FROM ${table} WHERE ${field} = $1 LIMIT 1`, [value]);
        return result.rows.length == 0;
    }
}

module.exports = ValidatorService;