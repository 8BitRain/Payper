import { StyleSheet, Dimensions } from 'react-native';

import colors from '../colors';
var dimensions = Dimensions.get('window');


const styles = StyleSheet.create({

  // Wrap for whole user preview
  userWrap: {
    flex: 1,
    height: 60,
    flexDirection: 'row',

    // borderWidth: 1,
    // borderColor: 'red',
  },

  // Wrap for the image portion of the preview
  picWrap: {
    flex: 0.25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: colors.offWhite,
  },

  // Wrap for the text portion of the preview
  textWrap: {
    flex: 0.75,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 15,

    backgroundColor: colors.white,
  },

  // User's picture
  pic: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderColor: colors.icyBlue,
    borderWidth: 1,
  },

  // Full name text
  fullnameText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.darkGrey,
  },

  // Username text
  usernameText: {
    fontSize: 12,
    color: colors.icyBlue,
  },

});

export default styles;
