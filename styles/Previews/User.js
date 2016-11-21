import { StyleSheet } from 'react-native'
import { colors } from '../../globalStyles'

const styles = StyleSheet.create({

  // Wrap for whole user preview
  userWrap: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    backgroundColor: colors.snowWhite,
  },

  // Wrap for the image portion of the preview
  picWrap: {
    flex: 0.25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Wrap for the text portion of the preview
  textWrap: {
    flex: 0.75,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 15,
  },

  // User's picture
  pic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: colors.accent,
    borderWidth: 1,
  },

  initials: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Full name text
  fullnameText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.deepBlue,
  },

  // Username text
  usernameText: {
    fontSize: 12,
    color: colors.accent,
  },

})

export default styles
