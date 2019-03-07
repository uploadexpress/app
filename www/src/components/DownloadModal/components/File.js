import React from 'react';
import DownloadIcon from '../../../img/img-download.svg';
import DownloadIconHover from '../../../img/img-download-hover.svg';
import stringTruncate from '../../../helpers/stringTruncate';
import extensionToImageIcon from '../../../helpers/extensionToImageIcon'


const File = (props) => {
    return ( 
        <div className="list-body d-flex flex-row">
            <img src={extensionToImageIcon(props.name)} alt=""/>
            <div className="list-file-name list-info">{stringTruncate(props.name, 23)}</div>
            <img  onClick={() => {props.onFileDownload(props.id)}} onMouseOver={e => e.currentTarget.src = DownloadIconHover} onMouseOut = {e => e.currentTarget.src = DownloadIcon} className ="ml-auto" style={{width:'8%'}} src={DownloadIcon} alt=""/>   
        </div>
    )
}

export default File