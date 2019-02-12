import React from 'react';
import FileIcon from '../../../img/file-icon.svg';
import ImgStatusYes from '../../../img/img-status-yes.svg';
import ImgCancel from '../../../img/img-cancel.svg'
import { FileStatus } from '../constants';
import { connect } from 'react-redux';
import { deleteFile } from '../actions'

const File = (props) => {
    let status = ""
    switch (props.status) {
        case FileStatus.WAITING:
            status = 'Waiting'
            break;
        case FileStatus.UPLOADING:
            status = 'Uploading'
            break;
        case FileStatus.DONE:
            status = 'Done'
            break;      
        default:   
            break;
    } 
    
    const deleteFile = () => {
        props.deleteFile(props.id)
    }
    


    return (
        <div className="list-body d-flex flex-row">
            <img style={{ width: '24%' }} src={FileIcon} alt="" />
            <div className="list-info d-flex flex-column">
                <div className=" d-flex flex-row justify-content-between ">
                    <div className="flex-column">
                        <div className="list-file-name">{props.name}</div>
                        <div className="list-status">
                        {
                            status
                        }
                        </div>
                    </div>
                    {props.status ===FileStatus.DONE &&
                        <div className="list-img-status">
                        <img src={ImgStatusYes} alt="" />
                    </div>
                    }

                    {props.status === FileStatus.EMPTY &&
                      <div className="list-img-status list-img-cancel">
                        <img onClick={deleteFile} src={ImgCancel} alt="" />
                      </div>       
                    }
     
                </div>
                { props.status !== FileStatus.EMPTY &&
                    <div className="list-download-bar">
                        <div className="list-download-bar-progress" style={{ width: `${props.progress}%` }} />
                    </div>
                }
            </div>
        </div>
    )
}

const mapDispatchToProps =(dispatch) => {
    return{
        deleteFile: (file) => dispatch(deleteFile(file))
    }
}

export default connect (null, mapDispatchToProps) (File)