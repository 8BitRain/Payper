// Dependencies
import {AsyncStorage} from 'react-native';

/**
  *   Gets user list from AsyncStorage and assigns it to this.allUsers
  *   @return: JSON formatted user list
**/
export async function getAllUsers() {
  try {
    const users = await AsyncStorage.getAllKeys();

    if (users !== null) {
      // We'll store our user objects here
      var usersArray = [];

      users = Promise.resolve(users);
      users.then(function(val) {

        for (var i in val) {
          if (val[i].indexOf("@Users") > -1) {

          }
        }

      });

      return usersArray;
    }
  } catch (error) {
    console.log("Error reading from AsyncStorage:");
    console.log(error);
  }
}

/**
  *   Gets one user by username from AsyncStorage
  *   @return: JSON formatted user
**/
export async function getUserbyUsername(username) {
  try {
    const user = await AsyncStorage.getItem('@Users:' + username);
    if (user !== null)
      return user;
  } catch (error) {
    console.log("Error reading from AsyncStorage:");
    console.log(error);
  }
}
