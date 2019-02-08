import axios from "axios";


const AccountService = {
    login: async function(email, password) {
        const res = await axios.put('/api/login', {
            email: email,
            password: password
        });

    },

    signup: async function(name, email, password) {
        const res = await axios.post('/api/accounts', {
            name: name,
            email: email,
            password: password
        });

    }
};

export default AccountService;