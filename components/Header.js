// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet} from "react-native";
import Button from "react-native-button";


// Header styles
const styles = StyleSheet.create({
  // Container for header elements
  headerWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingTop: 35,
    flexDirection: "row"
  },

  // Header chunk sizing
  chunkQuo: {
    flex: 0.25,
    alignItems: "center",
    // For testing
    backgroundColor: "red"
  },
  chunkHalf: {
    flex: 0.5,
    alignItems: "center",
    // For testing
    backgroundColor: "blue"
  },
  chunkThird: {
    flex: 0.33,
    alignItems: "center"
  },

  // Icon sizing
  iconX: {
    width: 20,
    height: 20
  },
  iconSettings: {
    width: 20,
    height: 20
  },
  iconCircle: {
    width: 12,
    height: 12,
    marginLeft: 2,
    marginRight: 2
  },
  iconPaymentSetup: {
    width: 20,
    height: 20,
    marginLeft: 4,
    marginRight: 4
  }
});


/**
  *   Toolbar for the create account onboarding process
  *
  *   TODO: implement pagination functionality by passing props and stuff
  *         (for now, the third page is always filled in)
**/
class Header extends React.Component {
  constructor(props) {
    console.log("TEST");
    super(props);

    // For testing, will typically be passed as a prop
    this.types = {
      "paymentIcons": true,
      "circleIcons": false,
      "settingsIcon": false,
      "closeIcon": true
    };
    this.index = 1;

  }
  render() {
    return(
      <View style={styles.headerWrap} types={types} index={index}>
        { /* Contains 'X' or 'Settings' icons if specified */ }
        <View style={styles.chunkQuo}>
          <Text>closeIcon = {this.types.closeIcon}</Text>
        </View>

        { /* Contains 'CircleIcons' or 'PaymentIcons' if specified */ }
        <View style={styles.chunkHalf}>
          <Text>paymentIcons = {this.types.paymentIcons}, index = {this.index}</Text>
        </View>

        { /* Filler */ }
        <View style={styles.chunkQuo}></View>
      </View>
    );
  }
};

export default Header;


{ /*

<View style={[toolbar.toolbar]}>
  <View style={toolbar.buttonWrap}></View>
  <View style={toolbar.circleWrap}>
    <Image style={toolbar.circle} source={require('./assets/circle-full.png')} />
    <Image style={toolbar.circle} source={require('./assets/circle.png')} />
    <Image style={toolbar.circle} source={require('./assets/circle.png')} />
    <Image style={toolbar.circle} source={require('./assets/circle.png')} />
    <Image style={toolbar.circle} source={require('./assets/circle.png')} />
    <Image style={toolbar.circle} source={require('./assets/circle.png')} />
  </View>
  <View style={toolbar.buttonWrap}>
    <Button style={toolbar.button} onPress={() => this.props.dispatchSetPage(1, "forward", this.props.emailValidations, this.emailInput)}>Next</Button>
  </View>
</View>

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: "pink",
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: "row"
  },
  toolbarButton: {
    width: 50,
    color: "#fff",
    textAlign: "center"
  },
  toolbarTitle: {
    color: "#fff",
    textAlign: "center",
    flex: 1
  }
});

const toolbar = StyleSheet.create({
  toolbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: "row",
    flex: 1
  },
  buttonWrap: {
    flex: 0.25,
    alignItems: 'center'
  },
  button: {
    width: 35,
    height: 35
  },
  circleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  circle: {
    width: 10,
    height: 10,
    marginLeft: 2.5,
    marginRight: 2.5
  }
});

const Header = React.createClass({
  render() {
    return(
      <View style={styles.toolbar}>
        <Text style={styles.toolbarButton}>Prev</Text>
        <Text style={styles.toolbarTitle}>This is the title</Text>
        <Text style={styles.toolbarButton}>Next</Text>
      </View>
    );
  }
});

*/ }
