import axios from "axios";
import AuthService from './auth.jsx'

const AccountService = {
    login: async function(email, password) {
        const res = await axios.put('/api/login', {
            email: email,
            password: password
        });
        AuthService.setHeader()
        return res;
    },

    signup: async function(value) {
        const res = await axios.post('/api/accounts', value);
        AuthService.setHeader()
        return res;
    },

    get: async function(id) {
        const res = await axios.get(`/api/accounts/${id}`)
        return res.data
    }
};

export default AccountService;