import initState from './initState'
import { SET_SETTINGS, SET_SETTING } from '../actions';

export default function settings(state = initState, action) {
    switch (action.type) {
        case SET_SETTINGS:
            return {
                ...state,
                ...action.settings
            }
        case SET_SETTING:
        return {
            ...state,
            [action.name]: action.value
        }
        default:
            return state;
    }
}