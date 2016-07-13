/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  Async.js  💣
  *
  *   contains abstractions of AsyncStorage's
  *     💣  getItem
  *     💣  setItem
  *     💣  mergeItem
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/


// Dependencies
import { AsyncStorage } from 'react-native';


/**
  *   Sets @Store:name to specified data in AsyncStorage
**/
export function set(name, data, callback) {
  if (typeof name == 'string' && typeof data == 'string') {
    try {
      AsyncStorage.setItem('@Store:' + name, data).then(() => {
        if (typeof callback == 'function') callback();
      }).done();
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Invalid log parameters. (If you're logging a JSON, be sure to stringify it first)");
  }
};


/**
  *   Gets @Store:name and returns it via callback function
**/
export function get(name, callback) {
  if (typeof name == 'string') {
    try {
      AsyncStorage.getItem('@Store:' + name).then((val) => {
        if (typeof callback == 'function') callback(val);
      }).done();
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Invalid log parameters. (Name must be a string)");
  }
};


/**
  *   Merges @Store:name's contents with specified data's contents
  *   Returns new value via callback function
**/
export function merge(name, data, callback) {
  if (typeof name == 'string' && typeof data == 'string') {
    try {
      AsyncStorage.mergeItem('@Store:' + name, data).then((val) => {
        if (typeof callback == 'function') callback(val);
      }).done();
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Invalid log parameters. (If you're logging a JSON, be sure to stringify it first)");
  }
};


/**
  *   Gets @Store:name and returns it via callback function
**/
export function remove(name, callback) {
  if (typeof name == 'string') {
    try {
      AsyncStorage.removeItem('@Store:' + name).then(() => {
        if (typeof callback == 'function') callback(true);
      }).done();
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log("Invalid log parameters. (Name must be a string)");
  }
};
