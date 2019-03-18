import React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '../../../img/img-download.svg';
import DownloadIconHover from '../../../img/img-download-hover.svg';
import stringTruncate from '../../../helpers/stringTruncate';
import extensionToImageIcon from '../../../helpers/extensionToImageIcon';


const File = (props) => {
  const { name } = props;
  return (
    <div className="list-body d-flex flex-row">
      <img src={extensionToImageIcon(name)} alt="" />
      <div className="list-file-name list-info">{stringTruncate(name, 23)}</div>
      {/* eslint-disable */}
      <img onClick={() => { props.onFileDownload(props.id); }} onMouseOver={e => e.currentTarget.src = DownloadIconHover} onMouseOut={e => e.currentTarget.src = DownloadIcon} className="ml-auto" style={{ width: '8%' }} src={DownloadIcon} alt="" />
    </div>
  );
};

File.propTypes = {
  name: PropTypes.string.isRequired,
}

export default File;
