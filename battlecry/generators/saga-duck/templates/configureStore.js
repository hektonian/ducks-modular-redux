import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import createSagaMiddleware, { END } from 'redux-saga';
import reducers from './reducers'
import initialState from './initialState';
import rootSaga from './rootSaga';

export default function configureStore(customInitialState = {}) {
    const loggerMiddleware = createLogger(); // Initialize logger
    const sagaMiddleware = createSagaMiddleware(); // Initialize sagas

    // Use Redux DevTools if available
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

    const store = createStore(
        reducers,
        { 
            ...initialState,
            ...customInitialState
        },
        composeEnhancers(
            applyMiddleware(loggerMiddleware, sagaMiddleware)
        )
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);
    store.runSaga(rootSaga);

    return store;
};
