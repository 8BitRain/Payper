import { StyleSheet, Dimensions } from 'react-native';

import colors from '../colors';
var dimensions = Dimensions.get('window');

const styles = StyleSheet.create({

  // Wrap for whole transaction preview
  wrap: {
    marginTop: 100,
    height: 150,
    width: dimensions.width * 0.9,
    marginLeft: dimensions.width * 0.05,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  // Wrap for top half (user and payment info)
  top: {
    flex: 0.65,
    backgroundColor: colors.white,

    flexDirection: 'row',

    borderColor: colors.icyBlue,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
  },

  // Wrap for bottom half (progress bar)
  bottom: {
    flex: 0.35,
    backgroundColor: colors.darkGrey,

    borderColor: colors.icyBlue,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderWidth: 1.5,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Progress bar styles
  barWrap: {
    flex: 0.7,
    flexDirection: 'row',
    height: 20,
    marginLeft: 35,
    marginRight: 35,

    borderRadius: 10,
    backgroundColor: colors.lightGrey,
  },

  bar: {
    borderRadius: 10,
    backgroundColor: colors.icyBlue,
  },

  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 3.5,
    fontFamily: 'Roboto',
    color: colors.darkGrey,
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
    borderColor: colors.icyBlue,
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

  text: {
    fontFamily: 'Roboto',
    color: colors.darkGrey,
    fontSize: 12,
  },

  name: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.icyBlue,
  },

  dots: {
    position: 'absolute',
    top: 0,
    right: 10,
    width: 50,
    height: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }


});

export default styles;
