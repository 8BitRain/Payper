import { AppRegistry } from 'react-native';
const Firebase = require('firebase');


// @todo remove when RN upstream is fixed
console.ignoredYellowBox = ['Warning: Failed propType: SceneView'];

import Coincast from './Coincast';

AppRegistry.registerComponent('Coincast', () => Coincast);
