/**
 * Constants
 */
export const ADD_FILES = 'ADD_FILES';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const START_UPLOADING = 'START_UPLOADING';
export const END_UPLOADING = 'END_UPLOADING';
export const DELETE_FILE = 'DELETE_FILE';

/** 
 * Actions
 */
export const addFiles = (files) => { return { type: ADD_FILES, files: files } } 
export const updateProgress = (fileId, progress) => { return { type: UPDATE_PROGRESS, fileId, progress}}
export const startUploading = () => { return { type: START_UPLOADING } }
export const endUploading = () => { return { type: END_UPLOADING } }
export const deleteFile = (file) => { return { type: DELETE_FILE, file: file } }