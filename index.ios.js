import { AppRegistry } from 'react-native';
import React from 'react';

import { Provider } from 'react-redux';
import store from './redux/store';

const Firebase = require('firebase');


// @todo remove when RN upstream is fixed
console.ignoredYellowBox = ['Warning: Failed propType: SceneView'];

import CoincastContent from './Coincast';

class Coincast extends React.Component{
  render(){
    return(
      <Provider store={store}>
        <CoincastContent/>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('Coincast', () => Coincast);
