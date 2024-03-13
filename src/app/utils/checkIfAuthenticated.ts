import Cookie from 'js-cookie'

export function checkIfAuthenticated() {
    var isLoggedIn = Cookie.get('isLoggedIn');
    if (isLoggedIn) {
        return true;
    }
    return false;
}