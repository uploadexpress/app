import React, { Component } from 'react';
import EmojiParty from '../../../img/emoji-party.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';


class LinkPreview extends Component {
    state = {
        copied: false
    } 
    render(){
        console.log(this.state.copied)
    
    return (
        <div className="listfiles">
            <div className="list-title">
                Share your link
            </div>
            <hr />
            <div className="list-container text-center">
                <img className="share-img" src={EmojiParty} alt="" />
                <div className="share-title">You're done!</div>
                <div className="share-subtitle">Copy your download link:</div>

                <input className="share-link" onFocus={(e) => { e.target.select() }} type="text" value={"https://upload.express/download/" + this.props.id} readonly />


            </div>
            <div className="list-footer">
                <CopyToClipboard text={'https://upload.express/download/' + this.props.id} onCopy={() => this.setState({copied: true})}>
                    <button className="btn green-btn">Copy</button>
                </CopyToClipboard>
                {this.state.copied === true &&
                <div className="link-preview-copied"> Copied!</div>
                }
            </div>
        </div>
    )
}
} 

export default LinkPreview