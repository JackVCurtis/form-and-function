import jwt from 'jsonwebtoken'
import axios from 'axios'

const AuthService = {
    user: undefined,

    isLoggedIn: () => {
        return !!AuthService.getToken();
    },

    getToken: () => {
        return getCookie('authorization');
    },

    getUser: () => {
        if (AuthService.user) { 
            return AuthService.user
        } else if (AuthService.isLoggedIn()) {
            AuthService.user = jwt.decode(AuthService.getToken()).sub
            return AuthService.user
        } else {
            return undefined
        }
    },

    setHeader: () => {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + AuthService.getToken();
    }
};

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

export default AuthService;

