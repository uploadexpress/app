export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_SETTING = 'SET_SETTING';
export const DELETE_BACKGROUND = 'DELETE_BACKGROUND';

export const setSettings = settings => ({ type: SET_SETTINGS, settings });
export const setSetting = (name, value) => ({ type: SET_SETTING, name, value });
export const deleteBackground = id => ({ type: DELETE_BACKGROUND, id });
