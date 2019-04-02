import initState from './initState';
import { SET_FILES, SELECT_FILE } from '../actions';

export default function download(state = initState, action) {
  switch (action.type) {
    case SET_FILES: {
      return {
        ...state,
        files: action.files,
        downloadId: action.downloadId,
        backgrounds: action.backgrounds,
        galleryOnly: action.galleryOnly,
      };
    }

    case SELECT_FILE: {
      return {
        ...state,
        files: state.files.map((file) => {
          if (file.id === action.id) {
            return {
              ...file,
              selected: action.selected,
            };
          }
          return file;
        }),
      };
    }
    default:
      return state;
  }
}
