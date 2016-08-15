import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
var Mixpanel = require('react-native-mixpanel');

// Stylesheets
import colors from '../styles/colors';
var dimensions = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.accent,
    width: dimensions.width - 50,
    height: 50,
    paddingTop: 14.5,
    borderRadius: 4,
    color: colors.white,
  }
});


class GenericSignUp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button style={styles.button} onPress={this.props.destination}>Sign Up</Button>
      </View>
    );
  }
}

export default GenericSignUp;
