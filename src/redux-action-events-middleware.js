export default class {
  
  constructor(type = 'type') {
    this.type = type;
    this.events = {};
  }


  on(actionTypes, callback) {
    if (!Array.isArray(actionTypes)) {
      actionTypes = [actionTypes];
    };

    for (let atype of actionTypes) {
      let event = this.events[atype] || (this.events[atype] = []);
      event.push(callback);
    }
    return this._getOff(actionTypes, callback);
  }


  _getOff(actionTypes, callback) {
    return () => {
      for (let atype of actionTypes) {
        let event = this.events[atype];
        let index = event.indexOf(callback);
        event.splice(index, 1);
      }
    }
  }


  getMiddleware() {
    return store => next => action => {
      let event = this.events[action[this.type]];
      if (event) {
        for (let callback of event) {
          callback(action);
        }
      }
      return next(action);
    }
  }

}

