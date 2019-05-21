import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RequestService from '../../../../services/Api/RequestService';
import Portal from '../../../../components/Portal/index';
import UploadModal from '../../../../components/UploadModal/components';
import Background from '../../../../components/Background';

class NewRequest extends Component {
  constructor() {
    super();
    this.requestService = new RequestService();
  }

  state = {
    name: null,
    description: null,
    isPublic: true,
    succeeded: false,
    id: null,
    copied: false,
  }

  saveRequest = () => {
    const { name, description, isPublic } = this.state;
    this.setState({
      succeeded: true,
    });
    this.requestService.createRequest(name, isPublic, description).then((result) => {
      this.setState({
        id: result.data.id,
      });
    });
  }

  render() {
    const {
      description, succeeded, id, copied,
    } = this.state;
    const { t } = this.props;
    const requestUrl = `${window.hostname}/request/${id}`;
    return (
      <Portal>
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div className="col-md-4 settings-container">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 d-flex justify-content-between mt-4">
                    <div className="container-name">{t('panel.request.new')}</div>
                    <button type="button" className="btn btn-pannel" onClick={this.saveRequest}>{t('panel.request.save')}</button>
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-md-12">
                    <div className="settings-title">{t('panel.request.accessibility')}</div>
                    <div className="settings-subtitle">
                      {t('panel.request.accessibilityDescription')}
                    </div>
                    <div className="form-check form-check-inline">
                      <label className="form-check-label settings-title mt-0"
                          htmlFor="accessibility-public">
                        <input className="form-check-input"
                          type="radio"
                          name="accessibility"
                          id="accessibility-public"
                          checked={isPublic}
                          onClick={() => { this.setState({ isPublic: true }); }} />
                        {t('panel.request.public')}
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <label className="form-check-label settings-title mt-0"
                        htmlFor="accessibility-private">
                        <input className="form-check-input"
                          type="radio"
                          name="accessibility"
                          id="accessibility-private"
                          checked={isPublic}
                          onClick={() => { this.setState({ isPublic: false }); }} />
                        {t('panel.request.private')}
                      </label>
                    </div>
                  </div>
                </div> */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="settings-title">{t('panel.request.name')}</div>
                    <div className="settings-subtitle">{t('panel.request.nameDescription')}</div>
                    <input type="type" className="form-control" onChange={(e) => { this.setState({ name: e.target.value }); }} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="settings-title">
                      {t('panel.request.description')}
                    </div>
                    <div className="settings-subtitle">
                      {t('panel.request.descriptionDescription')}
                    </div>
                    <textarea className="form-control request-textarea" rows="5" maxLength="128" onChange={(e) => { this.setState({ description: e.target.value }); }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-8 settings-background-max-height">
              <Background>
                <UploadModal description={description} />
              </Background>
            </div>

          </div>
        </div>
        {succeeded && (
          <div>
            <div className="request-background" />
            <div className="request-modal">
              <div className="m-5 text-center">
                <div className="request-modal-header">
                  <div className="request-modal-title">
                    {t('panel.request.success')}
                  </div>
                  <div className="input-group mt-2 ">
                    <CopyToClipboard
                      text={requestUrl}
                      onCopy={() => this.setState({ copied: true })}
                    >
                      <div className="input-group-prepend">
                        <span className="input-group-text request-copy">
                          <FontAwesomeIcon icon="copy" />
                        </span>
                      </div>
                    </CopyToClipboard>
                    <input type="text" className="form-control" onFocus={(e) => { e.target.select(); }} value={requestUrl} readOnly />
                  </div>
                  {copied && (
                    <div className="request-copied">
                      {t('panel.request.copied')}
                    </div>
                  )}
                </div>
                <Link to="/panel/requests" className="btn blue-btn mb-0">{t('panel.request.back')}</Link>

              </div>
            </div>
          </div>
        )
        }
      </Portal>

    );
  }
}

NewRequest.propTypes = {
  t: PropTypes.func.isRequired,
};


export default withTranslation()(NewRequest);
