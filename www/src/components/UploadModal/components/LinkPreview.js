import React, { Component } from 'react';
import EmojiParty from '../../../img/emoji-party.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withTranslation } from 'react-i18next';


class LinkPreview extends Component {
    state = {
        copied: false
    }

    
    render(){
        const { t } = this.props;
    return (
        <div className="listfiles">
            <div className="list-title">
                {t('upload.linkPreview.title')}
            </div>
            <hr />
            <div className="list-container text-center">
                <img className="share-img" src={EmojiParty} style={{width:'28%'}} alt="" />
                <div className="share-title">{t('upload.linkPreview.done')}</div>
                <div className="share-subtitle">{t('upload.linkPreview.copyLink')}</div>

                <input className="share-link" onFocus={(e) => { e.target.select() }} type="text" value={"https://upload.express/download/" + this.props.id} readonly />


            </div>
            <div className="list-footer">
                <CopyToClipboard text={'https://upload.express/download/' + this.props.id} onCopy={() => this.setState({copied: true})}>
                    <button className="btn green-btn">{t('upload.linkPreview.copy')}</button>
                </CopyToClipboard>
                {this.state.copied === true &&
                <div className="link-preview-copied"> {t('upload.linkPreview.copied')}</div>
                }
            </div>
        </div>
    )
}
} 

export default withTranslation()(LinkPreview)