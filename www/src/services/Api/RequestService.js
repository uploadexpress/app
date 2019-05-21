import Service from './service';

class RequestService extends Service {
    getRequestList = (page) => {
      const resourceUrl = '/requests/';
      return this.http.get(resourceUrl, {
        params: { current_page: page },
      });
    }

    createRequest = (name, isPublic, description) => {
      const resourceUrl = '/requests/';
      return this.http.post(resourceUrl, {
        name,
        public: isPublic,
        description,
      });
    }

    deleteRequest = (requestId) => {
      const resourceUrl = `/requests/${requestId}/ `;
      return this.http.delete(resourceUrl);
    }

    getRequest = (requestId) => {
      const resourceUrl = `/requests/${requestId}/`;
      return this.http.get(resourceUrl);
    }
}
export default RequestService;
