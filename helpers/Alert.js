/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  Alert.js  💣
  *
  *   Contains alert functions
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/


// Dependencies
import { Alert } from 'react-native';

export function message(options) {
  Alert.alert(
    options.title,
    options.message
  );
}
export function confirmation(options) {
  Alert.alert(
   options.title,
   options.message,
   [
     {text: options.cancelMessage, onPress: () => options.cancel(), style: 'cancel'},
     {text: options.confirmMessage, onPress: () => options.confirm()},
   ],
  );
}
