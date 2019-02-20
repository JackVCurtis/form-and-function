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

    logout: () => {
        deleteCookie('authorization')
        window.location.reload(false); 
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

function deleteCookie( name, path, domain ) {
  if( getCookie( name ) ) {
    document.cookie = name + "=" +
      ((path) ? ";path="+path:"")+
      ((domain)?";domain="+domain:"") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

export default AuthService;

