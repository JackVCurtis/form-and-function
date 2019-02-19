import ValidatorService from '../../../client/app/services/validatorService.jsx';


describe('Validator Service', () => {
    it('calls server for async validations', async function(){
        const res = await ValidatorService.validate(
            {email: 'jack.v.curtis@gmail.com'},
            [{
                fields: ["email"], 
                validators: ["isUnique:accounts,email"],
                messages: [""]
            }], 
            'POST /api/accounts'
        );

        expect(res).toEqual('ok');
    })

    it('validates email format', async function() {
        const res = await ValidatorService.validate(
            {email: 'invalidemail.com'},
            [{
                fields: ["email"], 
                validators: ["isEmailFormat"],
                messages: [""]
            }], 
            'POST /api/accounts'
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
            }],
            'POST /api/accounts'
        );

        expect(res[0].result).toBe(false);
    })

    it('validates password strength', async function() {
        const res = await ValidatorService.validate(
            {email: ''},
            [{
                fields: ["email"], 
                validators: ["isSecurePass"],
                messages: [""]
            }],
            'POST /api/accounts'
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
            }],
            'POST /api/accounts'
        );

        expect(res[0].result).toBe(false);
    })
})