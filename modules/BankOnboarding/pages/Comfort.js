// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Components
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import {colors} from '../../../globalStyles';
const dimensions = Dimensions.get('window');

export default class Comfort extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: "RobotoSlab-Regular", fontSize: 28, fontWeight: '400', color: colors.deepBlue, textAlign: 'center' }}>
            { "Let's verify your identity" }
            { "\n\n" }
            <Ionicons name={"md-lock"} color={colors.accent} size={48} />
            { "\n" }
          </Text>
          <Text style={{ fontFamily: "OpenSans", fontSize: 18, lineHeight: 18 * 1.20, fontWeight: '100', color: colors.deepBlue, width: dimensions.width * 1.0, textAlign: 'left', paddingLeft: 65, paddingRight: 75 }}>
            {(this.props.retry)
              ? "Your first identity verification failed. Please double check your information for accuracy and try again.\n\n(Hint: be sure to enter your billing address)"
              : "To ensure you're not being impersonated, we'll need to collect your" + "\n" + "Legal name" + "\n" + "Billing address" + "\n" + "Date of birth" + "\n" + "The last four digits of your social." }
            { "\n" }
          </Text>
        </View>

        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
          <ContinueButton text={"Continue"} onPress={() => this.props.nextPage()} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    width: dimensions.width,
    backgroundColor: colors.snowWhite,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 65
  }
});
