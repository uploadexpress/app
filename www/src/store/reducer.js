import {combineReducers} from 'redux';
import uploadReducer from '../components/UploadModal/reducer'

const rootReducer = combineReducers({
  uploader: uploadReducer
});

export default rootReducer;
