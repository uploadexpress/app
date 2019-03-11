import initState from './initState';
import { SET_FILES, SELECT_FILE } from '../actions'

export default function download (state = initState, action) {
    switch (action.type) {
        case SET_FILES: {
            return {
                ...state,
                files: action.files,
                downloadId: action.downloadId
            }
        }

        case SELECT_FILE: {
            return {
                ...state,
                files: state.files.map( (file) => {
                    if (file.id === action.id){
                        file.selected = action.selected
                    }
                    return file
                })
            }
        }
        default:
        return state
    } 
}