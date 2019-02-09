import React from 'react';
import FileIcon from '../../../img/file-icon.svg';
import ImgStatusYes from '../../../img/img-status-yes.svg'

const File = (props) => {
    return(
            <div className="list-body flex-row">
                <img style={{width:'24%'}} src={FileIcon} alt=""/>
                <div className="list-info flex-column">
                    <div className=" flex-row justify-content-between ">
                        <div className="flex-column">
                          <div className="list-file-name">{props.name}</div>
                           <div className="list-status">Done</div>
                        </div>
                        <div className="list-img-status">
                            <img src={ImgStatusYes} alt=""/>
                        </div>
                    </div>  
                    <div className="list-download-bar"></div>
                </div>
            </div>
    

    )
}

export default File