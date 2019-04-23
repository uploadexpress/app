/**
 * Constants
 */
export const ADD_FILES = 'ADD_FILES';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const START_UPLOADING = 'START_UPLOADING';
export const END_UPLOADING = 'END_UPLOADING';
export const DELETE_FILE = 'DELETE_FILE';
export const RESET_UPLOAD = 'RESET_UPLOAD';

/**
 * Actions
 */
export const addFiles = files => ({ type: ADD_FILES, files });
export const updateProgress = (fileId, progress) => ({ type: UPDATE_PROGRESS, fileId, progress });
export const startUploading = () => ({ type: START_UPLOADING });
export const endUploading = () => ({ type: END_UPLOADING });
export const deleteFile = file => ({ type: DELETE_FILE, file });
export const resetUpload = () => ({ type: RESET_UPLOAD });
