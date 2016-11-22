// Dependencies
import React from 'react';
import {View, Text, TextInput, StyleSheet, Image, TouchableHighlight} from 'react-native';
import Button from 'react-native-button';
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

// Styles
import {colors} from '../../globalStyles';

// Helper functions
import * as Async from '../../helpers/Async';
import * as Firebase from '../../services/Firebase';

// Header styles
const styles = StyleSheet.create({
  // Container for header elements
  headerWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.accent,
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: "row",
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

    paddingBottom: 5,
    paddingTop: 4,
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

    paddingBottom: 5,
    paddingTop: 4,
  },

  // Flow tab inner text
  flowTabText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.white,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 1,
    paddingBottom: 1,
  },

  // Active tab styles
  activeTab: { backgroundColor: colors.white },
  activeTabText: { color: colors.accent },

});

// Styles for unread notifications indicator
import notificationStyles from '../../styles/Notifications/Preview';

// Return a back icon
function getBackIcon(callback) {
  return(
    <Button onPress={() => callback()}>
      <EvilIcons style={styles.iconClose} name="chevron-left" size={30} color={colors.white}/>
    </Button>
  );
};

// Return a close modal icon
function getCloseIcon(callback) {
  return(
    <Button onPress={() => {callback()}}>
      <EvilIcons style={[styles.iconClose, {paddingTop: 4}]} name="close" size={25} color={colors.white}/>
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
      <EvilIcons style={[{marginLeft: 2.5, marginRight: 2.5, opacity: 0.7}, (index == 0) ? styles.iconActive : null]} name={"user"} size={26} color={colors.white}/>
      <Entypo style={[{marginLeft: 2.5, marginRight: 1, opacity: 0.7}, (index == 1) ? styles.iconActive : null]} name={"credit"} size={20} color={colors.white}/>
      <EvilIcons style={[{marginLeft: 1, marginRight: 2.5, opacity: 0.7}, (index == 2) ? styles.iconActive : null]} name={"pencil"} size={27} color={colors.white}/>
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

// Return app logo
function getAppLogo(){
  return(
    <View style={styles.iconWrap}>
      { <Image style={{width: 132, height: 132}}source={require('../../assets/images/logo.png')}/>  }
    </View>
  )
}

// Return tabs for switching between tracking flows
function getFlowTabs(activeTab, callbackIn, callbackOut) {
  return(
    <View style={[styles.flowTabWrap]}>
      { /* 'In' tab */ }
      <TouchableHighlight
        activeOpacity={(activeTab == 'incoming') ? 1.0 : 0.7}
        underlayColor={(activeTab != 'incoming') ? 'transparent' : colors.white}
        style={[styles.flowTabIn, (activeTab == 'incoming') ? styles.activeTab : null]}
        onPress={() => callbackIn()}>
        <Text style={[styles.flowTabText, (activeTab == 'incoming') ? styles.activeTabText : null]}>
          Incoming
        </Text>
      </TouchableHighlight>

      { /* 'Out' tab */ }
      <TouchableHighlight
        activeOpacity={(activeTab == 'outgoing') ? 1.0 : 0.7}
        underlayColor={(activeTab != 'outgoing') ? 'transparent' : colors.white}
        style={[styles.flowTabOut, (activeTab == 'outgoing') ? styles.activeTab : null]}
        onPress={() => callbackOut()}>
        <Text style={[styles.flowTabText, (activeTab == 'outgoing') ? styles.activeTabText : null]}>
          Outgoing
        </Text>
      </TouchableHighlight>
    </View>
  );
}

function getNotificationsIcon(callback, opacity, num) {
  return(
    <Button onPress={() => callback()}>
      <Entypo style={[styles.iconSettings, { opacity: opacity }]} name="globe" size={25} color={colors.white} />
      { (!num || num == 0) ? null :
        <View style={notificationStyles.numNotificationsWrap}>
          <Text style={notificationStyles.numNotificationsText}>{ num }</Text>
        </View>
      }
    </Button>
  );
}

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: this.props.activeFilter,
      index: 0
    };
  }

  render() {
    return(
      <View style={[styles.headerWrap, {backgroundColor: (this.props.backgroundColor) ? this.props.backgroundColor : (this.props.transparent) ? 'transparent' : (this.props.headerProps.accent) ? colors.accent : (this.props.headerProps.obsidian) ? colors.obisdian : colors.richBlack}]}>
        { /* Contains 'X' or 'Settings' icons if specified */ }
        <View style={styles.chunkQuo}>
          { this.props.headerProps.types.closeIcon ? getCloseIcon(this.props.callbackClose) : null }
          { this.props.headerProps.types.settingsIcon ? getSettingsIcon(this.props.callbackSettings) : null }
          { this.props.headerProps.types.backIcon ? getBackIcon(this.props.callbackBack) : null }
        </View>

        { /* Contains 'CircleIcons' or 'PaymentIcons' if specified */ }
        <View style={styles.chunkHalf}>
          { this.props.headerProps.title ? <Text style={{fontFamily: 'Roboto', fontSize: 16, color: colors.white, paddingTop: 5}}>{ this.props.headerProps.title }</Text> : null }
          { this.props.headerProps.types.paymentIcons ? getPaymentIcons(this.props.headerProps.index) : null }
          { this.props.headerProps.types.appLogo ? getAppLogo(): null}
          { this.props.headerProps.types.circleIcons ? getCircleIcons(this.props.headerProps.numCircles, this.props.headerProps.index) : null }
          { this.props.headerProps.types.flowTabs ? getFlowTabs(this.props.activeFilter, () => {this.setState({active: 'incoming'}); this.props.headerProps.callbackIn()}, () => {this.setState({active: 'outgoing'}); this.props.headerProps.callbackOut()}) : null }
        </View>

        { /* Filler */ }
        <View style={[styles.chunkQuo, { alignItems: 'center' }]}>
          { this.props.headerProps.types.closeIconTopRight ? getCloseIcon(this.props.callbackClose) : null }
          { this.props.headerProps.types.notificationsIcon ? getNotificationsIcon(this.props.headerProps.callbackNotifications, this.props.headerProps.opacity, (this.props.currentUser.appFlags) ? this.props.currentUser.appFlags.numUnseenNotifications : 0) : null }
        </View>
      </View>
    );
  }
};

export default Header;
