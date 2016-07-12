import { StyleSheet, Dimensions } from 'react-native';

import colors from '../colors';
var dimensions = Dimensions.get('window');

const styles = StyleSheet.create({

  // Wrap for whole transaction preview
  wrap: {
    width: dimensions.width * 1.0,
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
    borderColor: colors.icyBlue,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
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
    paddingTop: 4.0,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

});

export default styles;
