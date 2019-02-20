module.exports = class ValidatorService {
    constructor(asyncValidators) {
        this.asyncValidators = asyncValidators
        this.validate = this.validate.bind(this)
        this.containsAsync = this.containsAsync.bind(this)
        this.validateAsync = this.validateAsync.bind(this)

        this.validators = {
            exists: function (value) {
                return !!value; //Placeholder hack - needs to be more explicit
            },
            isEmailFormat: function (value) {
                try {
                    value.match
                } catch(e) {
                    return false;
                }
                const matchedVal = value.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
                return matchedVal != null;
            },
            isSecurePass: function (value) {
                return !!value && value.length >= 12;
            },
            matches: function (value1, value2) {
                return !!value1 && !!value2 && value1 == value2;
            }
        }
    }

    async validateAsync(object, validations, endpoint) {
        throw new Error("Attempted to call abstract method validateAsync on ValidatorService")
    }

    containsAsync(validations) {
        const validators = validations.flatMap((validation) => {
            return validation.validators.map((validator) => { return validator.split(':')[0]})
        });

        return validators
            .filter((validator) => { return !this.validators.hasOwnProperty(validator) }).length > 0
    }

    validate(object, validations, endpoint) {
        if (this.asyncValidators == undefined && this.containsAsync(validations)) {
            return this.validateAsync(object, validations, endpoint)
        }

        return new Promise((resolve, reject) => {
            if (validations.length == 0) {
                resolve([])
            }
            
            const results = validations.map((validation) => {
                const validatorResults = new Promise((resolve, reject) => {
                    resolve(validation.validators.map((validator, i) => {
                        var result = new Promise((resolve, reject) => {
                            const values = validation.fields.map((field) => { return object[field]; });
                            const validatorArray = validator.split(":");
                            const validationFunction = validatorArray[0];
                            const validatorArgs = (validatorArray.length > 1 ? validatorArray[1].split(",") : [])
                                .map((arg) => { return arg.match(/^\$/) ? object[arg.match(/(?<=\$)[\w]+/)[0]] : arg});
                            const args = values.concat(validatorArgs);
                            
                            if (this.validators.hasOwnProperty(validationFunction)) {
                                resolve({fields: validation.fields, validator: validator, result:this.validators[validationFunction](...args), message: validation.messages[i]});
                            } else if (this.asyncValidators && this.asyncValidators.hasOwnProperty(validationFunction)) {
                                this.asyncValidators[validationFunction](...args).then((result) => {
                                    resolve({fields: validation.fields, validator: validator, result: result, message: validation.messages[i]});
                                });
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
    }
}

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