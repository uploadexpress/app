import {combineReducers} from 'redux';
import uploadReducer from '../components/UploadModal/reducer'
import settingsReducer from '../scenes/Portal/Settings/reducer'

const rootReducer = combineReducers({
  uploader: uploadReducer,
  settings: settingsReducer
});

export default rootReducer;
