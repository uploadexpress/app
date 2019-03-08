export const SET_FILES = 'SET_FILES'
export const SELECT_FILE = 'SELECT_FILE'

export const setFiles = (files, downloadId) => { return {type: SET_FILES, files: files, downloadId: downloadId}}
export const selectFile = (id, selected) => {return {type: SELECT_FILE, id: id, selected:selected}}