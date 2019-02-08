const AuthService = {
    isLoggedIn: () => {
        return !!AuthService.getToken();
    },

    getToken: () => {
        return getCookie('authorization');
    }
};

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

export default AuthService;

