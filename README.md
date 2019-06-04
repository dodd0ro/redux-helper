# Что это? 
Инструмент помогающий при использовании redux сократить количество импортов и повторяющегося кода, не влияя на его реиспользуемость. 

# Краткое руководство
<!-- TOC -->
  - [начало](#начало)
  - [select](#select)
  - [get](#get)
  - [dispatch](#dispatch)
  - [создание констант](#создание-констант)
  - [наблюдатель](#наблюдатель)
  - [debug и middlevares](#debug-и-middlevares)
<!-- /TOC -->

## Начало
<sup>[[к оглавлению]](#Краткое-руководство)</sup>

Создание экземпляра ReduxHelper:
```js
import reducers from './reducers';
import actions from './actions';
import selectors from './selectors';

var reduxHelper = new ReduxHelper({reducers, actions, selectors});
```
Свойства reduxHelper:
  - store - redux *store*
  - actions - все ваши *действия*
  - selectors - все ваши *селекторы*

## select
<sup>[[к оглавлению]](#Краткое-руководство)</sup>

Пример получения данных их *store* с помощью *селекторов* без использования storeHelper:
```js
import store from './store';
import {getCapital} from './selectors/countries';
import {favoriteFood} from './selectors/animals';


var state = store.getState();

var x = getCapital(state, 'australia');
var x = favoriteFood(state, 'kangaroo');
```
 Аналог примера выше с использование storeHelper:
```js
import storeHelper from './storeHelper';

var capital = storeHelper.select('countries.getCapital', 'australia')
var food = storeHelper.select('animals.favoriteFood', 'kangaroo')
```
Метод `select` получает состояние *store* и передает его в *селектор*. При этом *селектор* может быть указан как строка отражающая его путь. Но так же это может быть и функция, которую можно импортировать или получить из свойства `selectors` экземпляра ReduxHelper:

```js
var getBirds = storeHelper.selectors['getBirds'];
var birds = storeHelper.select(getBirds);
```
## get
<sup>[[к оглавлению]](#Краткое-руководство)</sup>

Метод `get` позволяет получить данные из *state*:
```js
import storeHelper from './storeHelper';

var x = storeHelper.get('animals.birds.parrots')
```


## dispatch
<sup>[[к оглавлению]](#Краткое-руководство)</sup>

Метод `dispatch` аналогичен стандартному `store.dispatch`, за исключеним того, что помимо самого *действия* может принимать путь *генеротора действия*:

```js
storeHelper.dispatch('animals.addFish', 'shark')
storeHelper.dispatch(storeHelper.actions.animals.addFish('shark'))
```

## Создание констант
<sup>[[к оглавлению]](#Краткое-руководство)</sup>

Обычно константы создают так:
```js
export default {
  ADD_FISH: 'ADD_FISH',
  REMOVE_FISH: 'REMOVE_FISH',
  RENAME_FISH: 'RENAME_FISH'
};
```
С помощью `stingsToConstants` это можно сделать так:
```js
import { stingsToConstants } from 'redux-helper'
export default stingsToConstants([
  'ADD_FISH',
  'REMOVE_FISH',
  'RENAME_FISH'
]);
```

## Наблюдатель
<sup>[[к оглавлению]](#Краткое-руководство)</sup>

Метод `observe` позволяет запускать указанную функцию каждый раз, когда меняется значение указанного *селектора*:
```js
import storeHelper from './storeHelper';

storeHelper.observe('submarine.getColor', (color) => {
    console.log(color);
})
```
Метод возвращает функцию, вызвав которую можно прекратить отслеживание. Так же эта функция передается в *коллбэк*:
```js
storeHelper.observe('submarine.getColor', (color, unsubscribe) => {
    console.log(color);
    if (color !== 'yellow') {
        unsubscribe();
    }
})
```
Без использования ReduxHelper то же самое может выглядеть так:
```js
import store from './store';
import {getColor} from './selectors/submarine';

var unsubscribe;
var currentState;

unsubscribe = store.subscribe((color) => {
    var nextState = getColor(this.store.getState());
    if (nextState !== currentState) {
        currentState = nextState;
        console.log(color);
        if (color !== 'yellow') {
            unsubscribe();
        }
    }
});
```


## debug и middlevares
<sup>[[к оглавлению]](#Краткое-руководство)</sup>

При создании экземпляра ReduxHelper в конфигурацию можно передать массив с *middlevares* и включить режим отладки (Redux DevTools):
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
Либо это можно сделать самостоятельно и передать созданный *store* в конфигурацию:
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
<br><br>
---

# API
# ReduxHelper(options)

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

