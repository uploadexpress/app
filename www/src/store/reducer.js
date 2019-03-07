import {combineReducers} from 'redux'
import uploadReducer from '../components/UploadModal/reducer'
import settingsReducer from '../scenes/Portal/Settings/reducer'
import downloadReducer from '../scenes/Download/reducer'

const rootReducer = combineReducers({
  uploader: uploadReducer,
  settings: settingsReducer,
  downloader: downloadReducer
});

export default rootReducer
