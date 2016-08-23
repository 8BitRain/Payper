/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  SetMaster5000.js  💣
  *
  *   Contains functions for the following:
  *     💣  converting array to object map
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/

const enableLogs = false;

// Dependencies
import * as _ from 'lodash';

/**
  *   Given a notification object, return ready-to-render strings
**/
export function arrayToMap(arr) {
  var map = {};

  arr.forEach(function(element) {
    if (!map[element.sectionTitle]) map[element.sectionTitle] = [];
    map[element.sectionTitle].push(element);
  });

  if (enableLogs) {
    console.log("Converting array:", arr);
    console.log("to map:", map);
  }

  return map;
};
