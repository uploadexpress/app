import { combineReducers } from 'redux';
import uploadReducer from '../reducers/uploader';
import settingsReducer from '../reducers/settings';
import downloadReducer from '../reducers/downloader';

const rootReducer = combineReducers({
  uploader: uploadReducer,
  settings: settingsReducer,
  downloader: downloadReducer,
});

export default rootReducer;
