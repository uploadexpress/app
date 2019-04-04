import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImgStatusYes from '../../../img/img-status-yes.svg';
import ImgCancel from '../../../img/img-cancel.svg';
import FileBackground from '../../../img/file-background.svg';
import { FileStatus } from '../constants';
import { deleteFile } from '../actions';
import buttonize from '../../../helpers/buttonize';
import stringTruncate from '../../../helpers/stringTruncate';
import extensionToImageIcon from '../../../helpers/extensionToImageIcon';

const File = (props) => {
  const {
    progress, status, name, id,
  } = props;

  let statusString = '';
  switch (status) {
    case FileStatus.WAITING:
      statusString = 'Waiting';
      break;
    case FileStatus.UPLOADING:
      statusString = 'Uploading';
      break;
    case FileStatus.DONE:
      statusString = 'Done';
      break;
    default:
      break;
  }

  const deleteFile = () => {
    const { deleteFile, id } = props;
    deleteFile(id);
  };

  return (
    <div className="list-body d-flex flex-row">
      {id === 'backgrounds' ? (<img src={FileBackground} alt="" />)
        : (<img src={extensionToImageIcon(name)} alt="" />)}
      <div className="list-info d-flex flex-column justify-content-center">
        <div className=" d-flex flex-row justify-content-between ">
          <div className="flex-column">
            <div className="list-file-name">{stringTruncate(name, 23)}</div>
            <div className="list-status">
              {
                statusString
              }
            </div>
          </div>
          {status === FileStatus.DONE
            && (
              <div className="list-img-status">
                <img src={ImgStatusYes} alt="" />
              </div>
            )
          }

          {(id !== 'backgrounds' && status === FileStatus.EMPTY)
            && (
              <div className="list-img-status list-img-cancel">
                {/* eslint-disable */}
                <img 
                  {...buttonize(deleteFile)}
                  onClick={deleteFile}
                  src={ImgCancel}
                  alt=""
                />
                {/* eslint-enable */}
              </div>
            )
          }

        </div>
        {status !== FileStatus.EMPTY
          && (
            <div className="list-download-bar">
              <div className="list-download-bar-progress" style={{ width: `${progress}%` }} />
            </div>
          )
        }
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  deleteFile: file => dispatch(deleteFile(file)),
});

File.propTypes = {
  progress: PropTypes.number.isRequired,
  status: PropTypes.symbol.isRequired,
  name: PropTypes.string.isRequired,
  deleteFile: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default connect(null, mapDispatchToProps)(File);
