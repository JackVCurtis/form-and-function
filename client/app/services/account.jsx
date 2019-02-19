import axios from "axios";

const AccountService = {
    login: async function(email, password) {
        const res = await axios.put('/api/login', {
            email: email,
            password: password
        });
        return res;
    },

    signup: async function(value) {
        const res = await axios.post('/api/accounts', value);
        return res;
    }
};

export default AccountService;