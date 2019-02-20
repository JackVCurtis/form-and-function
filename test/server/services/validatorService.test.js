import ValidatorService from '../../../server/services/validatorService';
jest.mock('../../../server/services/db')

describe('Validator Service', () => {
    it('calls db to check if field is is unique', async function(){
        const res = await ValidatorService.validate(
            {email: 'jack.v.curtis@gmail.com'},
            [{
                fields: ["email"], 
                validators: ["isUnique:accounts,email"],
                messages: [""]
            }]
        );

        expect(res[0].result).toEqual(true);
    })

    it('validates email format', async function() {
        const res = await ValidatorService.validate(
            {email: 'invalidemail.com'},
            [{
                fields: ["email"], 
                validators: ["isEmailFormat"],
                messages: [""]
            }]
        );

        expect(res[0].result).toBe(false);
    })

    it('validates field existence', async function() {
        const res = await ValidatorService.validate(
            {email: ''},
            [{
                fields: ["email"], 
                validators: ["exists"],
                messages: [""]
            }]
        );

        expect(res[0].result).toBe(false);
    })

    it('validates password strength', async function() {
        const res = await ValidatorService.validate(
            {email: 'asdf'},
            [{
                fields: ["email"], 
                validators: ["isSecurePass"],
                messages: [""]
            }]
        );

        expect(res[0].result).toBe(false);
    })

    it('validates that two fields match', async function() {
        const res = await ValidatorService.validate(
            {password: 'asdf', confirmPassword: 'jlk;'},
            [{
                fields: ["confirmPassword"], 
                validators: ["matches:$password"],
                messages: [""]
            }]
        );

        expect(res[0].result).toBe(false);
    })
})