export const SET_FILES = 'SET_FILES';
export const SELECT_FILE = 'SELECT_FILE';

export const setFiles = (files, downloadId) => ({ type: SET_FILES, files, downloadId });
export const selectFile = (id, selected) => ({ type: SELECT_FILE, id, selected });
