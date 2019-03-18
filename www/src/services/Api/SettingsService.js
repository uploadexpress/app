import Service from './service';

class SettingsService extends Service {
    getSettings = (settings) => {
      const resourceUrl = '/settings/';
      return this.http.get(resourceUrl, {
        params: {
          ...settings,
        },
      });
    }

    sendSettings = (settings) => {
      const resourceUrl = '/settings/';
      return this.http.put(resourceUrl, settings);
    }

    sendLogo = (logo) => {
      const resourceUrl = '/settings/logo/';
      return this.http.post(resourceUrl, logo);
    }

    sendBackground = (background) => {
      const resourceUrl = '/settings/background/';
      return this.http.post(resourceUrl, background);
    }

    deleteBackground = (backgroundId) => {
      const resourceUrl = `/settings/background/${backgroundId}/`;
      return this.http.delete(resourceUrl);
    }
}

export default SettingsService;
