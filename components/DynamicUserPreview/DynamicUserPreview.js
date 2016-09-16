// Dependencies
import React from 'react';
import { View, Animated, TouchableHighlight, Text, Image, Dimensions } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Components
import UserPic from '../Previews/UserPic/UserPic';

// Styles
import styles from './assets/styles';
import colors from '../../styles/colors';

// Window dimensions
const dimensions = Dimensions.get('window');

class DynamicUserPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
    };
  }

  _handleSelect() {
    console.log("Pressed...");
    this.props.callbackSelect();
  }

  render() {
    return(
      <TouchableHighlight onPress={() => this._handleSelect()}>
        <View style={[styles.userWrap, {width: this.props.width}]}>
          <View style={styles.picWrap}>
            <UserPic width={50} height={50} user={this.props.user} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.fullnameText}>{ this.props.user.first_name + " " + this.props.user.last_name }</Text>
            <Text style={[styles.usernameText], {color: (this.props.user.provider || this.props.user.username) ? colors.accent : colors.icyBlue}}>
              { this.props.user.username || this.props.user.stylizedPhone }
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
};

export default DynamicUserPreview;
