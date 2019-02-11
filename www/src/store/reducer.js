import {combineReducers} from 'redux';
import uploadReducer from '../scenes/Upload/reducer'

const rootReducer = combineReducers({
  uploader: uploadReducer
});

export default rootReducer;
