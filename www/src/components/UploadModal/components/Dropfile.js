import React from 'react';
import { useTranslation } from 'react-i18next';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import Downloadbtn from '../../../img/download-btn.svg';
import Downloadbtnactive from '../../../img/download-btn-active.svg';


const Dropfile = (props) => {
  const { t } = useTranslation();
  const { onFilesSelected } = props;

  const onDrop = (acceptedFiles) => {
    onFilesSelected(acceptedFiles);
  };

  return (
    <div className="upload-window">
      <b className="upload-title">{t('upload.dropfile')}</b>
      <Dropzone onDrop={onDrop}>
        {({
          getRootProps, getInputProps, isDragActive,
        }) => (
          <div
            {...getRootProps()}
            className="upload-img"
          >
            <input {...getInputProps()} />

            <img src={isDragActive ? (Downloadbtnactive) : (Downloadbtn)} style={{ width: '60%' }} alt="" />
          </div>
        )}
      </Dropzone>
    </div>
  );
};

Dropfile.propTypes = {
  onFilesSelected: PropTypes.func.isRequired,
};

export default Dropfile;
