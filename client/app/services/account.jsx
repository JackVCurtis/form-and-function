import axios from "axios";


const AccountService = {
    login: async function(email, password) {
        const res = await axios.put('/api/login', {
            email: email,
            password: password
        });

        console.log(res);
    },

    signup: async function(name, email, password) {

    }
};

export default AccountService;