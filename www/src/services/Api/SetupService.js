import Service from './service';

export default class SetupService extends Service {
    setup = (email, password, lastName, firstName) => new Promise((resolve, reject) => {
      this.http.post('/setup/', {
        email,
        password,
        last_name: lastName,
        first_name: firstName,
      }).then((res) => {
        this.setToken(res.data.token);
        this.setProfile(res.data.user);
        resolve(res);
      }).catch(reject);
    })
}
