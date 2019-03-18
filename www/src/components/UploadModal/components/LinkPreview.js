import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import EmojiParty from '../../../img/emoji-party.png';


class LinkPreview extends Component {
  state = {
    copied: false,
  }

  render() {
    const { t, id } = this.props;
    const { copied } = this.state;
    const downloadUrl = `${window.hostname}/download/${id}`;
    return (
      <div className="listfiles">
        <div className="list-title">
          {t('upload.linkPreview.title')}
        </div>
        <hr />
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
      </div>
    );
  }
}

LinkPreview.propTypes = {
  t: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default withTranslation()(LinkPreview);
