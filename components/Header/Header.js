// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Image, TouchableHighlight} from "react-native";
import Button from "react-native-button";
import Entypo from "react-native-vector-icons/Entypo"

import colors from '../../styles/colors';

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
  iconActive: { opacity: 1.0 },

  // Flow tab wrapper
  flowTabWrap: {
    height: 30,
    width: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Left (in) flow tab
  flowTabIn: {
    flex: 0.5,
    borderColor: colors.white,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRightWidth: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    padding: 2.5,
  },

  // Right (out) flow tab
  flowTabOut: {
    flex: 0.5,
    borderColor: colors.white,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderLeftWidth: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    padding: 2.5,
  },

  // Flow tab inner text
  flowTabText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.white,
  },

  // Active tab styles
  activeTab: { backgroundColor: colors.white },
  activeTabText: { color: colors.darkGrey },

});


// Return a close modal icon
function getCloseIcon(callback) {
  return(
    <Button onPress={() => {callback()}}>
      <Image style={styles.iconClose} source={require('./assets/close.png')} />
    </Button>
  );
};

// Return a settings icon
function getSettingsIcon(callback) {
  return(
    <Button onPress={() => {callback()}}>
      <Entypo style={styles.iconSettings} name="cog" size={25} color="white"/>
    </Button>
  );
};

// Return payment pagination icons
function getPaymentIcons(index) {
  return(
    <View style={styles.iconWrap}>
      <Image style={[styles.iconPayment, (index == 0) ? styles.iconActive : null]} source={require('./assets/user.png')} />
      <Image style={[styles.iconPayment, (index == 1) ? styles.iconActive : null]} source={require('./assets/dollar.png')} />
      <Image style={[styles.iconPayment, (index == 2) ? styles.iconActive : null]} source={require('./assets/memo.png')} />
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

// Return tabs for switching between tracking flows
function getFlowTabs(activeTab, callbackIn, callbackOut) {
  return(
    <View style={styles.flowTabWrap}>
      { /* 'In' tab */ }
      <TouchableHighlight style={[styles.flowTabIn, (activeTab == 'in') ? styles.activeTab : null]} onPress={() => callbackIn()}>
        <Text style={[styles.flowTabText, (activeTab == 'in') ? styles.activeTabText : null]}>
          In
        </Text>
      </TouchableHighlight>

      { /* 'Out' tab */ }
      <TouchableHighlight style={[styles.flowTabOut, (activeTab == 'out') ? styles.activeTab : null]} onPress={() => callbackOut()}>
        <Text style={[styles.flowTabText, (activeTab == 'out') ? styles.activeTabText : null]}>
          Out
        </Text>
      </TouchableHighlight>
    </View>
  );
};


class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: 'out',
    }

    this.headerProps = this.props.headerProps;
  }
  render() {
    return(
      <View style={[styles.headerWrap, (this.props.dark) ? {backgroundColor: colors.darkGrey} : null ]}>
        { /* Contains 'X' or 'Settings' icons if specified */ }
        <View style={styles.chunkQuo}>
          { this.headerProps.types.closeIcon ? getCloseIcon(this.props.callbackClose) : null }
          { this.headerProps.types.settingsIcon ? getSettingsIcon(this.props.callbackSettings) : null }
        </View>

        { /* Contains 'CircleIcons' or 'PaymentIcons' if specified */ }
        <View style={styles.chunkHalf}>
          { this.headerProps.types.paymentIcons ? getPaymentIcons(this.headerProps.index) : null }
          { this.headerProps.types.circleIcons ? getCircleIcons(this.headerProps.numCircles, this.headerProps.index) : null }
          { this.headerProps.types.flowTabs
            ? getFlowTabs(this.state.active, () => {this.setState({active: 'in'}); this.props.callbackIn()}, () => {this.setState({active: 'out'}); this.props.callbackOut()})
            : null }
        </View>

        { /* Filler */ }
        <View style={styles.chunkQuo}></View>
      </View>
    );
  }
};

export default Header;
