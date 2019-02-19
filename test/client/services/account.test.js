import AccountService from '../../../client/app/services/account.jsx';

describe('Account Service', () => {
    it('Sends login request', async function() {
        const res = await AccountService.login('jack.v.curtis@gmail.com', 'asdf');
        expect(res.name).toEqual('Jack');
    })

    it('Sends signup request', async function() {
        const res = await AccountService.signup({
            name: 'Jack', 
            email: 'jack.v.curtis@gmail.com', 
            password: 'asdf', 
            confirmPassword: 'asdf'
        });

        expect(res.name).toEqual('Jack');
    })
})
