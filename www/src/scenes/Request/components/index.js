import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RequestService from '../../../services/Api/RequestService';
import Background from '../../../components/Background';
import UploadModal from '../../../components/UploadModal/components/index';


class Request extends Component {
    state = {
      description: null,
      requestId: null,
      error: false,
    };

    constructor() {
      super();
      this.requestService = new RequestService();
    }


    componentDidMount() {
      const { match } = this.props;
      const { id } = match.params;
      this.requestService.getRequest(id).then((result) => {
        this.setState({
          description: result.data.description,
          requestId: result.data.id,
        });
      }).catch(() => {
        this.setState({
          error: true,
        });
      });
    }


    render() {
      const { description, requestId, error } = this.state;
      return (
        <Background>
          <UploadModal description={description} requestId={requestId} error={error} />
        </Background>
      );
    }
}

Request.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
    }).isRequired,
  }).isRequired,
};

export default Request;
