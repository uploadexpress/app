import React from 'react';
import FileIcon from '../../../img/file-icon.svg';
import DownloadIcon from '../../../img/img-download.svg';
import DownloadIconHover from '../../../img/img-download-hover.svg';

const File = (props) => {
    return ( 
        <div className="list-body d-flex flex-row">
            <img src={FileIcon} alt=""/>
            <div className="list-file-name list-info">{props.name}</div>
            <img  onClick={() => {props.onFileDownload(props.id)}} onMouseOver={e => e.currentTarget.src = DownloadIconHover} onMouseOut = {e => e.currentTarget.src = DownloadIcon} className ="ml-auto" style={{width:'8%'}} src={DownloadIcon} alt=""/>   
        </div>
    )
}

export default File