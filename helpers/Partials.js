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
import { View, Image, Text, Dimensions } from 'react-native';
const dimensions = Dimensions.get('window');

// Stylesheets
import colors from '../styles/colors';
import userStyles from '../styles/Previews/User';


// Return a profile picture with the given source image
export function getUserPic(pic, name) {

  // If no profile picture, create and return initials thumbnail
  if (!pic || pic == "") {
    name = name.split(" ");
    var initials;
    (name.length > 1)
    ? initials = name[0].substring(0, 1) + name[name.length - 1].substring(0, 1)
    : initials = name[0].substring(0, 1);
    return(
      <View style={[userStyles.pic, userStyles.initials]}>
        <Text style={{fontFamily: 'Roboto', fontSize: 18, color: colors.orangeYellow}}>{ initials }</Text>
      </View>
    );
  };

  // If profile picture is present, crop to circle and return
  return <Image style={[userStyles.pic]} source={{uri: pic}} />;

};


class UserPic extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.pic || this.props.pic == "") {
      var name = this.props.name.split(" ");
      var initials;
      (name.length > 1)
        ? initials = name[0].substring(0, 1) + name[name.length - 1].substring(0, 1)
        : initials = name[0].substring(0, 1);
      return(
        <View style={{width: dimensions.width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <View style={[userStyles.pic, userStyles.initials, {width: this.props.width, height: this.props.height, borderRadius: this.props.width / 2}]}>
            <Text style={{fontFamily: 'Roboto', fontSize: 18, color: colors.orangeYellow}}>{ initials }</Text>
          </View>
        </View>
      );
    } else {
      return <Image style={{borderWidth: 1, borderColor: colors.orangeYellow, width: this.props.width, height: this.props.height, borderRadius: this.props.height / 2}} source={{uri: this.props.pic}} />;
    }
  }
};

export default UserPic;
