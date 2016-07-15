// Dependencies
import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, TouchableHighlight} from 'react-native';
import Button from 'react-native-button';

// Custom styles
import styles from '../../../styles/Previews/User';
import colors from '../../../styles/colors';
var dimensions = Dimensions.get('window');


// Return a profile picture with the given source image
function getUserPic(pic, name) {
  // If no profile picture, create and return initials thumbnail
  if (pic == "") {
    name = name.split(" ");
    var initials;
    (name.length > 1)
    ? initials = name[0].substring(0, 1) + name[name.length - 1].substring(0, 1)
    : initials = name[0].substring(0, 1);
    return(
      <View style={[styles.pic, styles.initials]}>
        <Text style={{fontFamily: 'Roboto', fontSize: 18, color: colors.icyBlue}}>{ initials }</Text>
      </View>
    );
  };

  // If profile picture is present, crop to circle and return
  return <Image style={styles.pic} source={{uri: pic}} />;
};


/**
  *   Returns a user preview for each the user specified in 'user' prop
**/
class UserPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.touchable) {
      return(
        <TouchableHighlight onPress={() => { this.props.callback(); }}>
          <View style={[styles.userWrap, {width: this.props.width}]}>
            <View style={styles.picWrap}>
              { getUserPic(this.props.user.profile_pic, this.props.user.name) }
            </View>
            <View ref={"textWrap"} style={styles.textWrap}>
              <Text style={styles.fullnameText}>{ this.props.user.first_name + " " + this.props.user.last_name }</Text>
              <Text style={styles.usernameText}>{ this.props.user.username }</Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    } else {
      return(
        <View style={[styles.userWrap, {width: this.props.width}]}>
          <View style={styles.picWrap}>
            { getUserPic(this.props.user.profile_pic, this.props.user.name) }
          </View>
          <View ref={"textWrap"} style={styles.textWrap}>
            <Text style={styles.fullnameText}>{ this.props.user.first_name + " " + this.props.user.last_name }</Text>
            <Text style={styles.usernameText}>{ this.props.user.username }</Text>
          </View>
        </View>
      );
    }
  }
};

export default UserPreview;
