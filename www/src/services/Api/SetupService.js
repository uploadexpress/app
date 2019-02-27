import Service from './service'

export default class SetupService extends Service {
    setup = (email, password, last_name, first_name) => {
        return new Promise((resolve, reject) => {
            this.http.post("/setup/", {
                email,
                password,
                last_name,
                first_name
            }).then(res => {
                this.setToken(res.data.token)
                this.setProfile(res.data.user)
                resolve(res);
            }).catch(reject);
        })
    }
}