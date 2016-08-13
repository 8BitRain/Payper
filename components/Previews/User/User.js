// Dependencies
import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions, TouchableHighlight} from 'react-native';
import Button from 'react-native-button';

// Custom styles
import styles from '../../../styles/Previews/User';
import colors from '../../../styles/colors';
var dimensions = Dimensions.get('window');

// Helper functions
import * as Partials from '../../../helpers/Partials';

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
              { Partials.getUserPic(this.props.user.profile_pic, this.props.user.first_name + " " + this.props.user.last_name) }
            </View>
            <View ref={"textWrap"} style={styles.textWrap}>
              <Text style={styles.fullnameText}>{ this.props.user.first_name + " " + this.props.user.last_name }</Text>
              <Text style={[styles.usernameText], {color: (this.props.user.phone) ? colors.alertGreen : colors.icyBlue}}>
                { this.props.user.username || this.props.user.stylizedPhone }
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    } else {
      return(
        <View style={[styles.userWrap, {width: this.props.width}]}>
          <View style={styles.picWrap}>
            { Partials.getUserPic(this.props.user.profile_pic, this.props.user.name) }
          </View>
          <View ref={"textWrap"} style={styles.textWrap}>
            <Text style={styles.fullnameText}>{ this.props.user.first_name + " " + this.props.user.last_name }</Text>
            <Text style={[styles.usernameText], {color: (this.props.user.phone) ? colors.alertGreen : colors.icyBlue}}>
              { this.props.user.username || this.props.user.stylizedPhone }
            </Text>
          </View>
        </View>
      );
    }
  }
};

export default UserPreview;
