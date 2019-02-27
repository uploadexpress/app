import Service from './service';
import decode from 'jwt-decode';

export default class AuthService extends Service {
    login = (email, password) => {
        // Get a token from api server using the fetch api
        return this.http.post("/auth/", {
            email,
            password
        }).then(res => {
            this.setToken(res.data.token)
            this.setProfile(res.data.user)
            return Promise.resolve(res);
        })
    }

    loggedIn = () => {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired = (token) => {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    } 
     
    logout = () => {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
    }
}
