import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducer';
import logger from 'redux-logger'

export default function configureStore() {
  
  return createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(logger)

  );
}