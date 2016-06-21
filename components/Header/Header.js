/**
  *     TODO DURING IMPLEMENTATION
  *     --------------------------
  *     In the header base view, there are class fields called 'types', 'index',
  *     and 'numCircles'. These are there for testing and, in actuality, should
  *     be defined in the state and passed in as props.
  *
  *     When the page changes, these props change in the state and the header
  *     is re-rendered.
**/




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
    // backgroundColor: "#593F62",
    backgroundColor: "transparent",
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: "row"
  },

  // Header chunk sizing
  chunkQuo: {
    flex: 0.25,
    // alignItems: "center",
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
    marginLeft: 15,
    width: 30,
    height: 30
  },
  iconSettings: {
    marginLeft: 15,
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
    <Button onPress={() => {console.log("-----  Closing modal  -----")}}>
      <Image style={styles.iconClose} source={require('./assets/close.png')} />
    </Button>
  );
};

// Return a settings icon
function getSettingsIcon() {
  return(
    <Button onPress={() => {console.log("-----  Opening settings  -----")}}>
      <Image style={styles.iconSettings} source={require('./assets/settings.png')} />
    </Button>
  );
};

// Return payment pagination icons
function getPaymentIcons(index) {
  return(
    <View style={styles.iconWrap}>
      <Image style={[styles.iconPayment, (index == 0) ? styles.iconActive : null]} source={require('./assets/user.png')} />
      <Image style={[styles.iconPayment, (index == 1) ? styles.iconActive : null]} source={require('./assets/memo.png')} />
      <Image style={[styles.iconPayment, (index == 2) ? styles.iconActive : null]} source={require('./assets/dollar.png')} />
    </View>
  );
};

// Return circle pagination icons
function getCircleIcons(numCircles, index) {
  var circles = [];
  for (var i = 0; i < numCircles; i++) {
    circles.push(<Image key={"circle#" + i} style={(styles.iconCircle)} source={(i == index) ? require('./assets/circle-active.png') : require('./assets/circle-inactive.png')} />);
  };
  return(
    <View style={styles.iconWrap}>
      { circles }
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

    // For testing, these will typically be passed as props
    this.headerProps = this.props.headerProps;
    // END For testing, these will typically be passed as props

  }
  render() {
    console.log("----- Rendered header ------");
    return(
      <View style={styles.headerWrap}>
        { /* Contains 'X' or 'Settings' icons if specified */ }
        <View style={styles.chunkQuo}>
          { this.headerProps.types.closeIcon ? getCloseIcon() : null }
          { this.headerProps.types.settingsIcon ? getSettingsIcon() : null }
        </View>

        { /* Contains 'CircleIcons' or 'PaymentIcons' if specified */ }
        <View style={styles.chunkHalf}>
          { this.headerProps.types.paymentIcons ? getPaymentIcons(this.headerProps.index) : null }
          { this.headerProps.types.circleIcons ? getCircleIcons(this.headerProps.numCircles, this.headerProps.index) : null }
        </View>

        { /* Filler */ }
        <View style={styles.chunkQuo}></View>
      </View>
    );
  }
};

export default Header;
