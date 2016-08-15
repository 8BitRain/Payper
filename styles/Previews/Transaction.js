import { StyleSheet, Dimensions } from 'react-native';

import colors from '../colors';
var dimensions = Dimensions.get('window');

const styles = StyleSheet.create({

  // Wrap for whole transaction preview
  wrap: {
    width: dimensions.width,
    flexDirection: 'column',
    justifyContent: 'center',
    borderBottomWidth: 0.8,
    borderColor: colors.lightGrey,
  },

  // Wrap for top half (user and payment info)
  top: {
    marginTop: 15,
    flex: 0.65,
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingRight: 5,
  },

  // Wrap for bottom half (progress bar)
  bottom: {
    marginTop: 15,
    marginBottom: 15,
    flex: 0.35,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Progress bar styles
  barWrap: {
    flex: 0.6,
    flexDirection: 'row',
    height: 22,
    marginLeft: 35,
    marginRight: 35,
    borderRadius: 15,
    borderColor: colors.accent,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },

  bar: {
    borderRadius: 10,
    backgroundColor: colors.accent,
  },

  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 4.0,
    fontFamily: 'Roboto',
    color: colors.richBlack,
    fontSize: 10,
    backgroundColor: 'transparent',
  },

  // Wrap for top left
  picWrap: {
    flex: 0.25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // User's picture
  pic: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderColor: colors.accent,
    borderWidth: 1,
  },

  initials: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Wrap for top right
  textWrap: {
    flex: 0.75,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  // Generic text styles
  text: {
    fontFamily: 'Roboto',
    color: colors.richBlack,
    fontSize: 12,
  },

  // Name text styles
  name: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.accent,
  },

  // Dot TouchableHighlight wrap
  dots: {
    position: 'absolute',
    top: -5,
    right: 5,
    width: 50,
    height: 50,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  cancel: {
    right: 35,
  },

  // Pending confirmation alert wrapper
  alertWrap: {
    position: 'absolute',
    top: 0,
    right: 12.5,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  // "Pending Confirmation"
  alert: {
    backgroundColor: colors.alertRed,
    borderRadius: 4,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Confirm and reject buttons wrapper
  confirmationWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Confirm and reject buttons
  confirmationButton: {
    marginLeft: 3.5,
    marginRight: 3.5,
    padding: 10,
    height: 30,
    width: 80,
    borderRadius: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Inner text for confirmation buttons
  confirmText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
  },

});

export default styles;
