// Dependencies
import {AsyncStorage} from 'react-native';

/**
  *   Returns array populated by getAllUsers()
**/
export async function returnAllUsers(callback) {
  try {
    await getAllUsers(function(users) {
      // Send users back to caller
      console.log("users in returnAllUsers(): " + JSON.stringify(users));
      callback(users);
    });
  } catch (error) {
    console.log("Error in returnAllUsers():")
    console.log(error);
  }
}

/**
  *   Gets all users from AsyncStorage and pushes their key value pairs to an array
  *   @return: JSON formatted user list
**/
async function getAllUsers(callback) {
  try {

    // Fetch all keys from AsyncStorage
    await AsyncStorage.getAllKeys().then(async function(keys) {
      var users = {};

      // Populate users[]
      for (var i in keys) {
        if (keys[i].indexOf("@Users:@") > -1) {
          var username = keys[i].split(":")[1];
          await getUserByUsername(username, function(username, user) {
            users[username] = JSON.parse(user);
          });
        }
      }

      // Send users back to caller
      callback(users);
    });

  } catch (error) {
    console.log("Error reading from AsyncStorage in getAllUsers():");
    console.log(error);
  }
}

/**
  *   Gets one user by username from AsyncStorage
  *   @return: JSON formatted user
**/
export async function getUserByUsername(username, callback) {
  try {
    await AsyncStorage.getItem('@Users:' + username).then(function(val) {
      callback(username, val);
    });
  } catch (error) {
    console.log("Error reading from AsyncStorage in getUserByUsername():");
    console.log(error);
  }
}
