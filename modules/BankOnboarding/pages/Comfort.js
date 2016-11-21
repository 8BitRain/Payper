// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Dimensions } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

// Components
import ContinueButton from '../subcomponents/ContinueButton';

// Stylesheets
import colors from '../../../styles/colors';
const dimensions = Dimensions.get('window');

export default class Comfort extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View>
          <Text style={{ fontFamily: 'Roboto', fontSize: 28, fontWeight: '200', color: colors.white, textAlign: 'center' }}>
            { "Let's verify your identity" }
            { "\n\n" }
            <EvilIcons name={"lock"} color={colors.accent} size={38} />
            { "\n" }
          </Text>
          <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', color: colors.white, width: dimensions.width * 1.0, textAlign: 'center', paddingLeft: 25, paddingRight: 25 }}>
            {(this.props.retry)
              ? "Your first identity verification failed. Please double check your information for accuracy and try again.\n\n(Hint: be sure to enter your billing address)"
              : "To ensure you're not being impersonated, we'll need to collect your legal name, billing address, date of birth, and the last four digits of your social." }
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
    backgroundColor: colors.richBlack,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 65
  }
});
