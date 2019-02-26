import React from 'react';
import Downloadbtn from '../../../img/download-btn.svg';
import Downloadbtnactive from '../../../img/download-btn-active.svg';
import { useTranslation } from 'react-i18next';
import Dropzone from 'react-dropzone'


const Dropfile = (props) => {

    const { t } = useTranslation();

    const onDrop = (acceptedFiles) => {
        props.onFilesSelected(acceptedFiles);
    }

    return (
        <div className="upload-window">
            <b className="upload-title">{t('upload.dropfile')}</b>
            <Dropzone onDrop={onDrop} >
                {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
                    return (
                        <div
                            {...getRootProps()}
                            className="upload-img"
                        >
                            <input {...getInputProps()} />

                            <img src={isDragActive ? (Downloadbtnactive) :(Downloadbtn)} style={{width:'60%'}} alt="" />
                        </div>
                    )
                }}
            </Dropzone>
        </div>
    )
}

export default Dropfile