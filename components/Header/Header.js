// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Image} from "react-native";
import Button from "react-native-button";


// Header styles
const styles = StyleSheet.create({
  // Container for header elements
  headerWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#593F62",
    // backgroundColor: "transparent",
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: "row"
  },

  // Header chunk sizing
  chunkQuo: {
    flex: 0.25,
    alignItems: "center",
    // For testing
    // borderColor: "red",
    // borderWidth: 1
  },
  chunkHalf: {
    flex: 0.5,
    alignItems: "center",
    // For testing
    // borderColor: "blue",
    // borderWidth: 1
  },
  chunkThird: {
    flex: 0.33,
    alignItems: "center",
    // For testing
    // borderColor: "green",
    // borderWidth: 1
  },

  // Inline icon positioning
  iconWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  // Icon sizing
  iconClose: {
    width: 40,
    height: 40
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
  iconPayment: {
    width: 20,
    height: 20,
    marginLeft: 4,
    marginRight: 4,
    opacity: 0.5
  },

  // Active icons are fully opaque
  iconActive: { opacity: 1.0 }
});


// Return a close modal icon
function getCloseIcon() {
  return(
    <Image style={styles.iconClose} source={require('./assets/close.png')} />
  );
};

// Return payment icons
function getPaymentIcons(index) {
  return(
    <View style={styles.iconWrap}>
      <Image style={[styles.iconPayment, (index == 0) ? styles.iconActive : null]} source={require('./assets/user.png')} />
      <Image style={[styles.iconPayment, (index == 1) ? styles.iconActive : null]} source={require('./assets/memo.png')} />
      <Image style={[styles.iconPayment, (index == 2) ? styles.iconActive : null]} source={require('./assets/dollar.png')} />
    </View>
  );
};

/**
  *   Toolbar for the create account onboarding process
  *
  *   TODO: implement pagination functionality by passing props and stuff
  *         (for now, the third page is always filled in)
**/
class Header extends React.Component {
  constructor(props) {
    super(props);

    // For testing, will typically be passed as a prop
    this.types = {
      "paymentIcons": true,
      "circleIcons": false,
      "settingsIcon": false,
      "closeIcon": true
    };
    this.index = 1;
    this.numCircles = 0;

  }
  render() {
    return(
      <View style={styles.headerWrap}>
        { /* Contains 'X' or 'Settings' icons if specified */ }
        <View style={styles.chunkQuo}>
          { this.types.closeIcon ? getCloseIcon() : null }
        </View>

        { /* Contains 'CircleIcons' or 'PaymentIcons' if specified */ }
        <View style={styles.chunkHalf}>
          { this.types.paymentIcons ? getPaymentIcons(this.index) : null }
        </View>

        { /* Filler */ }
        <View style={styles.chunkQuo}></View>
      </View>
    );
  }
};

export default Header;
