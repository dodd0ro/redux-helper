# Что это? 
Инструмент объединяющий reducers, actions и selectors в один объект, обладающий методами, которые помогают сократить количество импортов и повторяющегося кода, не влияя на его реиспользуемость.

# Краткое руководство
## Начало
Создание экземпляра ReduxHelper:
```js
import reducers from './reducers';
import actions from './actions';
import selectors from './selectors';

var storeHelper = new ReduxHelper({reducers, actions, selectors});
```


## select
Пример получения данных их store с помощью селекторов без использования storeHelper:
```js
import store from './store';
import {getComments} from './selectors/posts';
import {getComments} from './selectors/posts';

var state = store.getState();

var x = getComments(state, '123');
var x = getComments(state, '123');
```
 Аналог примера выше с использование storeHelper:
```js
import storeHelper from './storeHelper';

var x = storeHelper.select('posts.getComments', '123')
var x = storeHelper.select('posts.getComments', '123')
```
Метод select получает состояние store и передает его в селектор. При этом селектор может быть указан как строка отражающая его путь. Но так же это может быть и функция, которую можно импортировать или получить из свойства selectors экземпляра ReduxHelper:

```js
var getComments = storeHelper.selectors['getComments'];
var x = storeHelper.select(getComments);
```
## get

Метод get позволяет получить данные из state:
```js
import storeHelper from './storeHelper';

var x = storeHelper.get('users.posts.getComments')
```


## dispatch

Метод dispatch аналогичен стандартному store.dispatch, за исключеним того, что помимо самого действия может принимать путь генеротора действия:

```js
storeHelper.dispatch('main.setRoomNameAdvise', x)
storeHelper.dispatch(storeHelper.actions.addPost('text'))
```

## Создание констант
Обычно константы создают так:
```js
export default {
  SET_ROOM_ADVISE: 'SET_ROOM_ADVISE',
  SET_ROOM_ADVISE: 'ADD_SAVED_ROOM',
  SET_ROOM_ADVISE: 'REMOVE_SAVED_ROOM'
};
```
С помощью stingsToConstants это можно сделать так:
```js
import { stingsToConstants } from 'redux-helper'
export default stingsToConstants([
  'SET_ROOM_ADVISE',
  'ADD_SAVED_ROOM',
  'REMOVE_SAVED_ROOM'
]);
```

## Наблюдатель
Метод observe позволяет запускать указанную функцию каждый раз, когда меняется значение указанного селектора.
```js
import storeHelper from './storeHelper';

storeHelper.observe('users.posts.getComments', (val) => {
    console.log(val);
})
```
Метод возвращает функцию, вызвав которую можно прекратить отслеживание. Так же эта функция передается в коллбэк:
```js
import storeHelper from './storeHelper';

storeHelper.observe('users.posts.getComments', (val, unsubscribe) => {
    console.log(val);
    if (val > 0) {
        unsubscribe();
    }
})
```
Без использования ReduxHelper то же самое может выглядеть так:
```js
import store from './store';
import {selector} from './selectors/posts';

var unsubscribe;
var currentState;

unsubscribe = store.subscribe((val) => {
    var nextState = selector(this.store.getState());
    if (nextState !== currentState) {
        currentState = nextState;
        console.log(val);
        if (val > 0) {
            unsubscribe();
        }
    }
});
```


## debug и middlevares
При создании экземпляра ReduxHelper в конфигурацию можно передать массив с middlevares и включить режим отладки (Redux DevTools):
```js
import reducers from './reducers';
import actions from './actions';
import selectors from './selectors';
import middlevares from './middlevares';

var storeHelper = new ReduxHelper({
  reducers, actions, selectors, 
  middlevares,  // <--
  debug: true   // <--
});
```
Либо это можно сделать самостоятельно и передать созданный store в конфигурацию:
```js
import { createStore, applyMiddleware, compose } from 'redux'

import reducers from './reducers';
import actions from './actions';
import selectors from './selectors';
import middlevares from './middlevares';

var debug = true;

var composeEnhancers =
    (debug && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    || compose;

var enhancer = composeEnhancers(applyMiddleware(...middlevares));
var store = createStore(reducers, enhancer);

var storeHelper = new ReduxHelper({store, reducers, actions, selectors});
```


# API
# ReduxHelper(options) => {reducers, actions, selectors, middlevares, store, debug}

## store

## actions

## selectors
## observe(selector, onChange)

## get(path)

## select(selector, ...args)

## dispatch(action, ...args)

## dispatchOffer(action, ...args)

# Tools

## stingsToConstants(strings)

