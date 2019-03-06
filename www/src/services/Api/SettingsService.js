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

    sendBackground = (background) => {
        let resourceUrl = '/settings/background/'
        return this.http.post(resourceUrl, background)
    }

    deleteBackground = (backgroundId) => {
        let resourceUrl=`/settings/background/${backgroundId}/`
        return this.http.delete(resourceUrl)
    }
}

export default SettingsService