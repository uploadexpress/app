import { applyMiddleware, compose, createStore } from 'redux';
import logger from 'redux-logger';
import rootReducer from './reducer';

export default function configureStore() {
  return createStore(
    rootReducer,
    compose(applyMiddleware(logger)),
  );
}
