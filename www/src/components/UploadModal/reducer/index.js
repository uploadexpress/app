import initialState from './initialState';
import { ADD_FILES, UPDATE_PROGRESS, START_UPLOADING, END_UPLOADING, DELETE_FILE, RESET_UPLOAD } from '../actions';
import { FileStatus, UploaderStatus } from '../constants';

export default function upload(state = initialState, action) {
  switch (action.type) {
    case ADD_FILES:
      return {
        ...state,
        files: [
          ...state.files,
          ...action.files
        ],
        status: UploaderStatus.FILE_LIST
      };

      case DELETE_FILE:
        let files = state.files.filter (file => {
          return file.id !== action.file
        })
        return {
          ...state,
          files,
          status: files.length === 0 ? UploaderStatus.NO_FILES : UploaderStatus.FILE_LIST
        }
    case START_UPLOADING:
      return {
        ...state,
        status: UploaderStatus.UPLOADING,
        files: state.files.map((file) => {
          file.status = FileStatus.WAITING
          return file
        })
      }
    case END_UPLOADING:
      return {
        ...state,
        status: UploaderStatus.DONE
      }  
    case UPDATE_PROGRESS:
      return {
        ...state,
        files: state.files.map((file) => {
          if (file.id === action.fileId) {
            file.progress = action.progress
            file.status = action.progress === 100 ? FileStatus.DONE : FileStatus.UPLOADING
          }
          return file
        })
      } 
      
      case RESET_UPLOAD: 
      return{
        ...state,
        status: UploaderStatus.NO_FILES,
        files: []
      }
    default:
      return state;
  }
}