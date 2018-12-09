import rootStore from '../redux/RootStore';
import { loginSuccess } from '../redux/Auth/AuthActions';
import { getAuthToken, setAuthToken } from './auth';
import request from './requests';

function tryLoginFromToken() {
    const token = getAuthToken();
    request('POST', '/login/token')
        .body({
            token,
        })
        .then(res => res.json())
        .then((res) => {
            rootStore.dispatch(loginSuccess(res));
        })
        .catch(() => {
            // if the token stored in the browser failed to log us in, just destroy it
            setAuthToken('');
        });
}

export default function bootstrap() {
    // other bootstrapy tasks can be put here as needed
    tryLoginFromToken();
}
