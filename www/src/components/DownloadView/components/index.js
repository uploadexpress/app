import React, { Component } from 'react';
import Background from '../../Background';
import Modal from '../../Modal';
import File from './File';
import Preview from './Preview'
import '../style/index.css';
import { connect } from 'react-redux';
import ImgOops from '../../../img/img-oops.svg';
import { withTranslation } from 'react-i18next';


class DownloadView extends Component {
    state = {
        showPreview: false
    }


    renderFiles() {
        return this.props.files.map(file => {
            return (
                <File
                    name={file.name}
                    id={file.id}
                    size={file.size}
                    onFileDownload={this.props.onFileDownload}
                />
            )
        })
    }

    hasPreview = () => {
        return this.props.files.reduce((accumulateur, valeurCourante) => {
            if (valeurCourante.preview_url) {
                accumulateur = true
            }
            return accumulateur
        }, false)
    }

    showPreview = () => {
        this.setState({
            showPreview: !this.state.showPreview
        })
    }

    render() {
        const { t } = this.props;

        return (
            <Background>

                <Modal>
                    <div className="listfiles">
                        {(this.props.error) ? (
                            <div className="list-title">{t('download.oops.header')}</div>
                            ) : (
                            <div className="list-title">{t('download.header')}</div>
                            )}
                        <hr />
                        <div className='list-container'>
                            {this.renderFiles()}
                            {this.props.error &&
                                <div className="list-body">
                                    <div className="list-container text-center">
                                        <img width={100} src={ImgOops} alt="" />
                                        <div className="oops-title">{t('download.oops.title')}</div>
                                        <div className="oops-subtitle">{t('download.oops.subtitle')}</div>

                                    </div>
                                </div>
                            }
                        </div>

                        {!this.props.error &&
                            <div className="list-footer">
                                <button onClick={this.props.onZipDownload} className="green-btn">{t('download.button')}</button>

                                {this.props.preview && this.hasPreview() &&
                                    <a onClick={this.showPreview} className={this.props.settings.upload_position == 'flex-end' ? ("preview-btn-left") : ("preview-btn-right")}>
                                    {t('download.gallery')} </a>
                                }
                            </div>}
                    </div>
                </Modal>
                {this.state.showPreview &&
                    <Preview onFileDownload={this.props.onFileDownload} />
                }

            </Background>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        settings: state.settings
    }
}

export default connect(mapStateToProps)(withTranslation()(DownloadView))