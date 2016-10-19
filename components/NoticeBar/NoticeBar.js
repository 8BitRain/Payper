// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

// Stylesheets
import styles from './styles';
import colors from '../../styles/colors';

export default class NoticeBar extends React.Component {
  constructor(props) {
    super(props);
    this.height = new Animated.Value(0);
    this.state = {
      messages: {
        "awaitingMicrodepositVerification": "Press to verify your bank account",
        "bank": "Press to connect your bank account"
      }
    };
  }

  componentDidMount() {
    this.show();
  }

  show() {
    Animated.timing(this.height, {
      toValue: 120,
      duration: 400,
      easing: Easing.elastic(1.25)
    }).start();
  }

  hide() {
    Animated.timing(this.height, {
      toValue: 0,
      duration: 400,
      easing: Easing.elastic(1.25)
    }).start();
  }

  render() {
    return(
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor={colors.richBlack}
        style={{ borderTopWidth: 1.0, borderBottomWidth: 1.8, borderColor: colors.accent }}
        onPress={() => console.log("Pressed")}>

        <Animated.View style={[styles.wrap, { height: this.height }]}>
          <FontAwesome name={"bank"} size={22} color={colors.accent} style={{ padding: 5 }} />
          <Text style={styles.text}>
            { this.state.messages[this.props.onboardingState] }
          </Text>
          <Entypo name={"chevron-thin-right"} color={colors.accent} size={16} style={{ padding: 5 }} />
        </Animated.View>

      </TouchableHighlight>
    );
  }
}
