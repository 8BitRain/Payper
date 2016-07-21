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
    backgroundColor: colors.icyBlue,
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: "row",

    // borderBottomWidth: 1,
    // borderBottomColor: colors.lightGrey,
  },

  // Header chunk sizing
  chunkQuo: {
    flex: 0.25,
  },
  chunkHalf: {
    flex: 0.5,
    alignItems: "center",
  },
  chunkThird: {
    flex: 0.33,
    alignItems: "center",
  },

  // Inline icon positioning
  iconWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  activeTabText: { color: colors.icyBlue },

});


// Return a close modal icon
function getCloseIcon(callback) {
  return(
    <Button onPress={() => {callback()}}>
      <Entypo style={styles.iconClose} name="cross" size={25} color={colors.white}/>
    </Button>
  );
};

// Return a settings icon
function getSettingsIcon(callback) {
  return(
    <Button onPress={() => {callback()}}>
      <Entypo style={styles.iconSettings} name="menu" size={25} color={colors.white}/>
    </Button>
  );
};

// Return payment pagination icons
function getPaymentIcons(index) {
  return(
    <View style={styles.iconWrap}>
      <Entypo style={[{marginLeft: 2.5, marginRight: 2.5, opacity: 0.5}, (index == 0) ? styles.iconActive : null]} name="user" size={20} color={colors.white}/>
      <Entypo style={[{marginLeft: 2.5, marginRight: 2.5, opacity: 0.5}, (index == 1) ? styles.iconActive : null]} name="credit" size={20} color={colors.white}/>
      <Entypo style={[{marginLeft: 2.5, marginRight: 2.5, opacity: 0.5}, (index == 2) ? styles.iconActive : null]} name="new-message" size={20} color={colors.white}/>
    </View>
  );
};

// Return circle pagination icons
function getCircleIcons(numCircles, index) {
  var circles = [];
  for (var i = 0; i < numCircles; i++) {
    circles.push(<Entypo key={i} style={{marginLeft: 2.5, marginRight: 2.5, marginTop: (index == i) ? 1.1 : 0}} name={(index == i) ? "controller-record" : "circle"} size={(index == i) ? 16 : 11} color={colors.white} />);
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
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={'transparent'}
        style={[styles.flowTabIn, (activeTab == 'in') ? styles.activeTab : null]}
        onPress={() => callbackIn()}>
        <Text style={[styles.flowTabText, (activeTab == 'in') ? styles.activeTabText : null]}>
          In
        </Text>
      </TouchableHighlight>

      { /* 'Out' tab */ }
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={'transparent'}
        style={[styles.flowTabOut, (activeTab == 'out') ? styles.activeTab : null]}
        onPress={() => callbackOut()}>
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
      index: 0,
    }
  }


  render() {
    return(
      <View style={[styles.headerWrap, (this.props.dark) ? {backgroundColor: colors.darkGrey} : null ]}>
        { /* Contains 'X' or 'Settings' icons if specified */ }
        <View style={styles.chunkQuo}>
          { this.props.headerProps.types.closeIcon ? getCloseIcon(this.props.callbackClose) : null }
          { this.props.headerProps.types.settingsIcon ? getSettingsIcon(this.props.callbackSettings) : null }
        </View>

        { /* Contains 'CircleIcons' or 'PaymentIcons' if specified */ }
        <View style={styles.chunkHalf}>
          { this.props.headerProps.title ? <Text style={{fontFamily: 'Roboto', fontSize: 16, color: colors.white, paddingTop: 5}}>{ this.props.headerProps.title }</Text> : null }
          { this.props.headerProps.types.paymentIcons ? getPaymentIcons(this.props.index) : null }
          { this.props.headerProps.types.circleIcons ? getCircleIcons(this.props.headerProps.numCircles, this.props.headerProps.index) : null }
          { this.props.headerProps.types.flowTabs ? getFlowTabs(this.state.active, () => {this.setState({active: 'in'}); this.props.callbackIn()}, () => {this.setState({active: 'out'}); this.props.callbackOut()}) : null }
        </View>

        { /* Filler */ }
        <View style={styles.chunkQuo}></View>
      </View>
    );
  }
};

export default Header;
