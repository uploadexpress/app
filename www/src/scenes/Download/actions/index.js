export const SET_FILES = 'SET_FILES'

export const setFiles = (files, downloadId) => { return {type: SET_FILES, files: files, downloadId: downloadId}}