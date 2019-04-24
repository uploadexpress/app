import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { ReactMultiEmail } from 'react-multi-email';
import EmojiParty from '../../../img/emoji-party.png';
import 'react-multi-email/style.css';
import UploadService from '../../../services/Api/UploadService';


class LinkPreview extends Component {
  state = {
    copied: false,
    recipientEmails: [],
    emailSent: false,
    error: null,
  }

  constructor() {
    super();
    this.uploadService = new UploadService();
  }

  sendEmail = (e) => {
    e.preventDefault();
    const { id, i18n } = this.props;
    const { recipientEmails, senderEmail, message } = this.state;
    if (recipientEmails.length === 0) {
      this.setState({
        error: 'You must enter at least one recipient email',
      });
      return;
    }
    this.uploadService.sendEmail(id, recipientEmails, senderEmail, message, i18n.language.split('-')[0]).then(() => {
      this.setState({
        emailSent: true,
        error: null,
      });
    }).catch(() => {
      this.setState({
        error: 'An unknown error occurred',
      });
    });
  }

  render() {
    const { t, id } = this.props;
    const {
      copied, recipientEmails, emailSent, error,
    } = this.state;
    const downloadUrl = `${window.hostname}/download/${id}`;
    return (
      <div className="listfiles">
        <Tabs>
          <TabList>
            <Tab>Share link</Tab>
            <Tab>Share via Email</Tab>
          </TabList>
          <TabPanel>
            <div className="list-container text-center">
              <img className="share-img" src={EmojiParty} style={{ width: '28%' }} alt="" />
              <div className="share-title">{t('upload.linkPreview.done')}</div>
              <div className="share-subtitle">{t('upload.linkPreview.copyLink')}</div>
              <input className="share-link" onFocus={(e) => { e.target.select(); }} type="text" value={downloadUrl} readOnly />
            </div>
            <div className="list-footer">
              <CopyToClipboard text={downloadUrl} onCopy={() => this.setState({ copied: true })}>
                <button type="button" className="btn green-btn">{t('upload.linkPreview.copy')}</button>
              </CopyToClipboard>
              {copied && (
                <div className="link-preview-copied">
                  {' '}
                  {t('upload.linkPreview.copied')}
                </div>
              )}
            </div>
          </TabPanel>
          <TabPanel>
            <form onSubmit={this.sendEmail}>
              <div className="list-container pt-0 pb-2 pr-2 pl-2 ml-2 mr-2" style={{ maxHeight: '244px' }}>
                {error
                  && (
                  <div className="error-message text-center pb-2">
                    {error}
                  </div>
                  )
                }
                <div className="email-title mb-1">From:</div>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text input-img">
                      <FontAwesomeIcon icon="envelope" />
                    </span>
                  </div>
                  <input type="email" className="form-control custom-form" placeholder="Email" name="email" aria-label="Email" required onChange={(e) => { this.setState({ senderEmail: e.target.value }); }} />
                </div>
                <div className="email-title mt-2 mb-1">To:</div>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text input-img">
                      <FontAwesomeIcon icon="paper-plane" />
                    </span>
                  </div>
                  <ReactMultiEmail
                    placeholder="Email"
                    emails={recipientEmails}
                    onChange={(recipientEmails) => {
                      this.setState({ recipientEmails });
                    }}
                    getLabel={(
                      email,
                      index,
                      removeEmail,
                    ) => (
                      <div data-tag key={index}>
                        {email}
                        <span data-tag-handle onClick={() => removeEmail(index)}>
                            ×
                        </span>
                      </div>
                    )}
                  />
                </div>
                <div className="email-title mt-2 mb-1">Message:</div>
                <textarea className="form-control email-textarea" placeholder="Write your message here" rows="3" onChange={(e) => { this.setState({ message: e.target.value }); }} />
              </div>
              <div className="list-footer">
                { emailSent
                  ? (<p className="text-center email-sent">Sent!</p>)
                  : (<input type="submit" className="btn green-btn" value="Send" />)
                 }

              </div>

            </form>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

LinkPreview.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  i18n: PropTypes.shape({}).isRequired,

};

export default withTranslation()(LinkPreview);
