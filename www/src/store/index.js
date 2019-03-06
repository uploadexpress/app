import { applyMiddleware, compose, createStore } from 'redux'
import rootReducer from './reducer'
import logger from 'redux-logger'

export default function configureStore() {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    return createStore(  
        rootReducer,
        composeEnhancer(applyMiddleware(logger))
    )
}