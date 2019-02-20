import axios from "axios";
const ValidatorService = require('../../../shared/validatorService.js');

class ClientValidator extends ValidatorService {
    constructor(){
        super()
    }

    async validateAsync(object, validations, endpoint) {
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

            return res.data;
        } catch (e) {
            throw new Error("Error requesting validation from server")
        }
    }
}

export default new ClientValidator()