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

    this.colorInterpolator = new Animated.Value(0);

    this.state = {
      color: this.colorInterpolator.interpolate({
        inputRange: [0, 350], // Transparent, green
        outputRange: ['rgba(0, 0, 0, 0.0)', 'rgba(16, 191, 90, 0.85)'],
      }),
    };
  }

  componentDidMount() {
    if (this.props.selected) this._interpolateBackgroundColor({ toValue: 350 });
    else this._interpolateBackgroundColor({ toValue: 0 });
  }

  componentWillReceiveProps(nextProps) {
    // Throws an error on initial render
    try {
      if (nextProps.selected) this._interpolateBackgroundColor({ toValue: 350 });
      else this._interpolateBackgroundColor({ toValue: 0 });
    } catch(err) {
      console.log(err);
    }
  }

  _interpolateBackgroundColor(options) {
    Animated.spring(this.colorInterpolator, {
      toValue: options.toValue,
    }).start();
  }

  _handleSelect() {
    if (this.props.selected) this._interpolateBackgroundColor({ toValue: 0 });
    else this._interpolateBackgroundColor({ toValue: 350 });
    this.props.callbackSelect();
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={'transparent'}
        onPress={() => this._handleSelect()}>

        <Animated.View style={[styles.userWrap, { borderColor: this.state.color, borderLeftWidth: 8, width: this.props.width }]}>
          <View style={styles.picWrap}>
            <UserPic width={50} height={50} user={this.props.user} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.fullnameText}>{ this.props.user.first_name + " " + this.props.user.last_name }</Text>
            <Text style={[styles.usernameText], {color: (this.props.user.provider || this.props.user.username) ? colors.accent : colors.icyBlue}}>
              { this.props.user.username || this.props.user.stylizedPhone }
            </Text>
          </View>
        </Animated.View>

      </TouchableHighlight>
    );
  }
};

export default DynamicUserPreview;
