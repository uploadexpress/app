export const SET_FILES = 'SET_FILES';
export const SELECT_FILE = 'SELECT_FILE';

export const setFiles = (files, downloadId, backgrounds, galleryOnly) => ({
  type: SET_FILES,
  files,
  downloadId,
  backgrounds,
  galleryOnly,
});

export const selectFile = (id, selected) => ({ type: SELECT_FILE, id, selected });
