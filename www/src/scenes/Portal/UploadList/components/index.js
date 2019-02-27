import React, { Component } from 'react'
import '../../style/index.css';
import { withTranslation } from 'react-i18next';
import Portal from '../../index'
import UploadService from '../../../../services/Api/UploadService'
import {Link} from 'react-router-dom'

class UploadList extends Component {
    constructor(){
        super();
        this.uploadService = new UploadService();
    }

    state = {
        result: []
    }
    
    componentDidMount(){
        this.uploadService.getUploadList().then((result) => {
            this.setState({
                ...result.data
            }) 
            // console.log(this.state)
            console.log("Bonjour")
        })
        console.log("Patrick")
    }

    render() {
        const { t } = this.props;
        return(
            <Portal history={this.props.history}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                        <div className="settings-section">{t('panel.uploadList.title')}</div>
                        <Link to='/' className="btn green-btn mb-3">{t('panel.uploadList.uploadFile')}</Link>
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

                                    {this.state.result.map(row => {
                                        return(
                                            <tr>
                                        <td className="table-body-title">{row.name}</td>
                                        <td className="table-body-title">https://upload.express/download/{row.id}</td>
                                        <td className="table-body-title">{row.files.length}</td>
                                        <td className="table-body-title">100</td>
                                    </tr>
                                        )
                                    }) } 
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
                </Portal>
        )
    }
}

export default withTranslation()(UploadList)