import initState from './initState';
import { SET_SETTINGS, SET_SETTING, DELETE_BACKGROUND } from '../actions';

export default function settings(state = initState, action) {
  switch (action.type) {
    case SET_SETTINGS:
      return {
        ...state,
        ...action.settings,
      };
    case SET_SETTING:
      return {
        ...state,
        [action.name]: action.value,
      };
    case DELETE_BACKGROUND: {
      const backgrounds = state.backgrounds.filter(background => background.id !== action.id);
      return {
        ...state,
        backgrounds,
      };
    }
    default:
      return state;
  }
}
