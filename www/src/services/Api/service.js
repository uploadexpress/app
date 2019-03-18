import axios from 'axios';

export default class Service {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : `${window.hostname}/v1`;

    this.http = axios.create({
      baseURL: this.baseURL,
    });

    this.http.interceptors.request.use((config) => {
      const apiToken = this.getToken();
      return {
        ...config,
        headers: { Authorization: `Bearer ${apiToken}` },
      };
    }, error => Promise.reject(error));
  }

  setToken = (idToken) => {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
  }

  setProfile = (user) => {
    localStorage.setItem('profile', JSON.stringify(user));
  }

  getToken = () => (
    // Retrieves the user token from localStorage
    localStorage.getItem('id_token')
  )

  getProfile = () => (
    JSON.parse(localStorage.getItem('profile'))
  )
}
