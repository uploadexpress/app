import initState from './initState';
import { SET_FILES } from '../actions'

export default function download (state = initState, action) {
    switch (action.type) {
        case SET_FILES: {
            return {
                ...state,
                files: action.files,
                downloadId: action.downloadId
            }
        }

        default:
        return state
    } 
}