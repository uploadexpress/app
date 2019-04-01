export const SET_FILES = 'SET_FILES';
export const SELECT_FILE = 'SELECT_FILE';

export const setFiles = (files, downloadId, backgrounds) => ({
  type: SET_FILES,
  files,
  downloadId,
  backgrounds,
});

export const selectFile = (id, selected) => ({ type: SELECT_FILE, id, selected });
