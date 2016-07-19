/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  Partials.js  💣
  *
  *   Contains getter functions for the following partial components:
  *     💣  user picture
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/

// Dependencies
import React from 'react';
import { View, Image, Text } from 'react-native';

// Stylesheets
import colors from '../styles/colors';
import userStyles from '../styles/Previews/User';


// Return a profile picture with the given source image
export function getUserPic(pic, name) {
  // If no profile picture, create and return initials thumbnail
  if (pic == "") {
    name = name.split(" ");
    var initials;
    (name.length > 1)
    ? initials = name[0].substring(0, 1) + name[name.length - 1].substring(0, 1)
    : initials = name[0].substring(0, 1);
    return(
      <View style={[userStyles.pic, userStyles.initials]}>
        <Text style={{fontFamily: 'Roboto', fontSize: 18, color: colors.icyBlue}}>{ initials }</Text>
      </View>
    );
  };

  // If profile picture is present, crop to circle and return
  return <Image style={userStyles.pic} source={{uri: pic}} />;
};
