import React, { Component } from 'react'
import Navbar from '../../../../components/Navbar';
import '../../style/index.css';
import { withTranslation } from 'react-i18next';

class UploadList extends Component {
    render() {
        const { t } = this.props;
        return(
            <div>
                <Navbar/>
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                        <div className="settings-section">{t('panel.uploadList.title')}</div>
                        <button className="btn green-btn mb-3">{t('panel.uploadList.uploadFile')}</button>
                        </div>
                        <hr className='ordinary-hr'/>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <table className="table upload-table">
                                <thead >
                                    <tr className="table-head" >
                                        <th className="table-head-title">{t('panel.uploadList.name')}</th>
                                        <th className="table-head-title">{t('panel.uploadList.link')}</th>
                                        <th className="table-head-title">{t('panel.uploadList.files')}</th>
                                        <th className="table-head-title">{t('panel.uploadList.downloads')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="table-body-title">Oxana et Maxence</td>
                                        <td className="table-body-title">https://upload.express/download/5c73b3f28c5551000fd70e7a</td>
                                        <td className="table-body-title">3</td>
                                        <td className="table-body-title">100</td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default withTranslation()(UploadList)