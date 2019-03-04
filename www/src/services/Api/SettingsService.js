import Service from './service'

class SettingsService extends Service {
    getSettings = (settings) => {
        let resourceUrl = '/settings/'
        return this.http.get(resourceUrl, {
            params: {
                ...settings 
            }
        })
    }

    sendSettings = (settings) => {
        let resourceUrl = '/settings/'
        return this.http.put(resourceUrl, settings)
    }

    sendLogo = (logo) => {
        let resourceUrl ='/settings/logo/'
        return this.http.post(resourceUrl, logo)
    }
}

export default SettingsService