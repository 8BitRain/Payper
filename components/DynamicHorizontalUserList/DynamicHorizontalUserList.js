// Dependencies
import React from 'react';
import { View, Animated, TouchableHighlight, Text, Image, Dimensions, ScrollView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Components
import DynamicThumbnail from '../DynamicThumbnail/DynamicThumbnail';

// Styles
import styles from './assets/styles';
import colors from '../../styles/colors';

// Window dimensions
const dimensions = Dimensions.get('window');

class DynamicHorizontalUserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      height: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(nextProps) {
    // Handle animation
    if (nextProps.contacts.length > 0 && !this.state.visible) {
      this._show();
    } else if (nextProps.contacts.length == 0 && this.state.visible) {
      this._hide();
    }
  }

  _show() {
    this.setState({ visible: true });
    Animated.spring(this.state.height, {
      toValue: 65,
      velocity: 4,
    }).start();
  }

  _hide() {
    this.setState({ visible: false });
    Animated.spring(this.state.height, {
      toValue: 0,
      velocity: 5,
    }).start();
  }

  _handleDeselect() {
    console.log("Deselecting user...");
  }

  _getThumbnails() {
    var thumbnails = [];

    for (var c in this.props.contacts) {
      thumbnails.push(
        <DynamicThumbnail key={this.props.contacts[c].phone} width={40} height={40} user={this.props.contacts[c]} />
      );
    }

    return thumbnails;
  }

  render() {
    return(
      <Animated.View onPress={() => this._hide()} style={[styles.wrap, { height: this.state.height }]}>

        { /* Thumbnail list */ }
        <ScrollView
          style={styles.horizontalScrollView}
          automaticallyAdjustContentInsets={false}
          horizontal={true}>

          { this._getThumbnails() }

        </ScrollView>
      </Animated.View>
    );
  }
};

export default DynamicHorizontalUserList;
