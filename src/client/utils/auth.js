
const TOKEN_KEY = 'AUTH_TOKEN';

export function getAuthToken() {
    return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
    window.localStorage.setItem(TOKEN_KEY, token);
}
