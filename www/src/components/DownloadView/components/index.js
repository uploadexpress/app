import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Modal from '../../Modal';
import File from './File';
import Preview from './Preview';
import '../style/index.css';
import Oops from '../../OopsPage';

class DownloadView extends Component {
  state = {
    showPreview: false,
  }

  hasPreview = () => {
    const { files } = this.props;
    return files.reduce((accumulateur, current) => {
      if (current.preview_url) {
        return true;
      }
      return accumulateur;
    }, false);
  }

  showPreview = () => {
    const { showPreview } = this.state;
    this.setState({
      showPreview: !showPreview,
    });
  }

  renderFiles() {
    const { files, onFileDownload } = this.props;
    return files.map(file => (
      <File
        name={file.name}
        id={file.id}
        size={file.size}
        onFileDownload={onFileDownload}
        key={file.id}
      />
    ));
  }

  render() {
    const {
      t,
      error,
      onZipDownload,
      settings,
      preview,
      onFileDownload,
      galleryOnly,
      uploadName,
      expiration,
    } = this.props;
    const { showPreview } = this.state;

    if (error) {
      return (
        <Modal>
          <Oops />
        </Modal>
      );
    }

    return (
      <div className={settings.upload_position === 'flex-end' ? ('d-flex flex-row-reverse gallery') : ('d-flex gallery')}>
        {!galleryOnly
            && (
              <div className="ml-3 mr-3">
                <Modal>
                  <div className="listfiles">
                    <div className="list-title">{t('download.header')}</div>
                    <hr />
                    <div className="list-container">
                      {this.renderFiles()}
                    </div>

                    <div className="list-footer">
                      <button type="button" onClick={onZipDownload} className={expiration ? ('green-btn mb-0') : ('green-btn')}>{t('download.button')}</button>
                      {expiration
                        && (
                          <div className="download-expiration">{t('download.expiration_date', { date: expiration })}</div>
                        
                        )}

                      {preview && this.hasPreview()
                          && (
                            /* eslint-disable */
                            <a onClick={this.showPreview} className={settings.upload_position == 'flex-end' ? ('preview-btn-left') : ('preview-btn-right')}>
                              {t('download.gallery')}
                            </a>
                            /* eslint-enable */
                          )
                        }
                    </div>

                  </div>
                </Modal>
              </div>

            )}

        {(showPreview || galleryOnly)
            && (
            <Preview
              onZipDownload={onZipDownload}
              uploadName={uploadName}
              onFileDownload={onFileDownload}
            />
            )
          }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
});

DownloadView.defaultProps = {
  galleryOnly: false,
  onZipDownload: () => {},
  error: false,
  uploadName: '',
};

DownloadView.propTypes = {
  t: PropTypes.func.isRequired,
  error: PropTypes.bool,
  onZipDownload: PropTypes.func,
  settings: PropTypes.shape({}).isRequired,
  preview: PropTypes.bool.isRequired,
  onFileDownload: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  galleryOnly: PropTypes.bool,
  uploadName: PropTypes.string,
  expiration: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(withTranslation()(DownloadView));
