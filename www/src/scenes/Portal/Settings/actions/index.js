export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_SETTING = 'SET_SETTING'

export const setSettings = (settings) => { return { type: SET_SETTINGS, settings: settings } };
export const setSetting = (name, value) => { return { type: SET_SETTING, name: name, value:value }}