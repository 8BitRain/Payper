// Dependencies
import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, TouchableHighlight} from 'react-native';
import Button from 'react-native-button';

// Custom styles
import styles from '../../../styles/Previews/User';
var dimensions = Dimensions.get('window');


// Return a profile picture with the given source image
function getUserPic(pic) {
  return(
    <Image style={styles.pic} source={{uri: pic}} />
  );
};

/**
  *   Returns a user preview for each the user specified in 'user' prop
**/
class UserPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("----- Rendered user preview for " + this.props.user.username + " ------");
    return(
      <TouchableHighlight onPress={() => { this.props.callback(); }}>
        <View style={[styles.userWrap, {width: this.props.width}]}>
          <View style={styles.picWrap}>
            { getUserPic(this.props.user.pic) }
          </View>
          <View ref={"textWrap"} style={styles.textWrap}>
            <Text style={styles.fullnameText}>{ this.props.user.first_name + " " + this.props.user.last_name }</Text>
            <Text style={styles.usernameText}>{ this.props.user.username }</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
};

export default UserPreview;
