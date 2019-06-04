import _ from 'lodash';
import { createStore, applyMiddleware, compose } from 'redux'

export default class ReduxHelper {
  constructor(options) {
    const reducers = options.reducers;
    const actions = options.actions;
    const selectors = options.selectors;
    const middlevares = options.middlevareArr || [];
    const debug = options.debug || false;

    this.store = this._createStore(reducers, middlevares, debug);
    this.actions = actions;
    this.selectors = selectors;
  }

  _createStore(reducers, middlevares, debug) {
    let composeEnhancers =
    (debug && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    || compose;
  
    let enhancer = composeEnhancers(applyMiddleware(...middlevares));
    let store = createStore(reducers, enhancer);
  
    return store;
  };

  observe(selector, onChange) {
    if (typeof selector === 'string') selector = _.at(this.selectors, selector);
    let currentState;
    let unsubscribe;
  
    function handleChange() {
      let nextState = selector(this.store.getState());
      if (nextState !== currentState) {
        currentState = nextState;
        onChange(currentState, unsubscribe);
      }
    }
    
    unsubscribe = this.store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
  }
  
  get(path) {
    return _.at(this.store.getState(), path)[0];
  }

  select(selector, ...args) {
    if (typeof selector === 'string') selector = _.at(this.selectors, selector)[0];
    return selector(this.store.getState(), ...args);
  }

  dispatch(action, ...args) {
    action = this._detAction(action, ...args);
    this.store.dispatch(action);
  }

  dispatchOffer(action, ...args) {
    action = this._detAction(action, ...args);
    if (action.isOffer) return;
    action.isOffer = true;
    this.store.dispatch(action)
  }

  _detAction(action, ...args) {
    switch (typeof action) {
      case 'string':
        action = _.at(this.actions, action)[0];
      case 'function':
        action = action(...args);
    }
    return action;
  }

}


export function stingsToConstants(strings) {
  const constants = {};
  for (let str of strings) {
    constants[str] = str;
  }
  return constants
}