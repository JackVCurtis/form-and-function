module.exports = {
    exists: function (value) {
        return !!value; //Placeholder hack - needs to be more explicit
    },
    isEmailFormat: function (value) {
        try {
            value.match
        } catch(e) {
            return false;
        }
        const matchedVal = value.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
        return matchedVal != null;
    },
    isSecurePass: function (value) {
        return !!value && value.length >= 12;
    },
    matches: function (value1, value2) {
        return !!value1 && !!value2 && value1 == value2;
    }
}