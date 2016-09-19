// Dependencies
import React from 'react';
import { View, Animated, Easing, TouchableHighlight, Text, Image, Dimensions, ScrollView } from 'react-native';
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
      height: new Animated.Value(1.5),
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
    Animated.timing(this.state.height, {
      toValue: 60,
      duration: 200,
      easing: Easing.elastic(1),
    }).start();
  }

  _hide() {
    this.setState({ visible: false });
    Animated.timing(this.state.height, {
      toValue: 1.5,
      duration: 100,
      easing: Easing.linear,
    }).start();
  }

  _handleDeselect() {
    console.log("Deselecting user...");
  }

  _getThumbnails() {
    var thumbnails = [];

    for (var c in this.props.contacts) {
      thumbnails.push(
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          key={this.props.contacts[c].phone}
          onPress={() => this._handleDeselect()}>

          <View>
            <DynamicThumbnail width={30} height={30} user={this.props.contacts[c]} />
          </View>

        </TouchableHighlight>
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
