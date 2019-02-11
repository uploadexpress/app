/**
 * Constants
 */
export const ADD_FILES = 'ADD_FILES';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';

/** 
 * Actions
 */
export const addFiles = (files) => { return { type: ADD_FILES, files: files } } 
export const updateProgress = (fileId, progress) => { return { type: UPDATE_PROGRESS, fileId, progress}}