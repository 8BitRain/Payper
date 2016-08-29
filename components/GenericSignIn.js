import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';

// Stylesheets
import colors from '../styles/colors';
var dimensions = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    // marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 13,
    width: dimensions.width - 50,
    height: 30,
    borderRadius: 4,
  }
});


class GenericSignIn extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button style={styles.button} onPress={this.props.destination}>
          <Text style={{fontFamily: 'Roboto', color: colors.white, fontSize: 16, fontWeight: '100'}}>
            Continue without Facebook
          </Text>
        </Button>
      </View>
    );
  }
}

export default GenericSignIn;
