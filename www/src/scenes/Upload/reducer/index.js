import initialState from './initialState';
import { ADD_FILES, UPDATE_PROGRESS } from '../actions';

export default function upload(state = initialState, action) {
  switch (action.type) {
    case ADD_FILES:
      return {
        ...state,
        files: [
          ...state.files,
          ...action.files
        ]
      };
    case UPDATE_PROGRESS:
      return {
        ...state,
        files: state.files.map((file) => {
          if (file.id === action.fileId) {
            file.progress = action.progress
          }
          return file
        })
      }  
    default:
      return state;
  }
}