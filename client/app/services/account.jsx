import axios from "axios";


const AccountService = {
    login: async function(email, password) {
        const res = await axios.put('/api/login', {
            email: email,
            password: password
        });

    },

    signup: async function(value) {
        const res = await axios.post('/api/accounts', value);

    }
};

export default AccountService;