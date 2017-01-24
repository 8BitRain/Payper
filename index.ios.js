import { AppRegistry } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';

// Creates a persistent connection to Firebase right when the app starts
import Firebase from './services/Firebase';

var Symbol = require('es6-symbol');

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = ['Warning: Failed propType: SceneView'];

import CoincastRouter from './Coincast';

class Coincast extends React.Component{
  render(){
    return(
      <Provider store={store}>
        <CoincastRouter />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('Coincast', () => Coincast);
