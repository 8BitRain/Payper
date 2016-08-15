import { StyleSheet } from 'react-native';
import colors from '../colors';

const styles = StyleSheet.create({

  // Row styles
  notificationWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 15,
  },

  // Wrap styles for unread notifications
  unreadWrap: {
    backgroundColor: colors.lightGrey,
  },

  // General text styles
  text: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.richBlack,
  },

  // Notification chunks
  userWrap: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 6,
  },
  textWrap: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  // Entypo icon
  iconWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    overflow: 'hidden',
    bottom: -6,
    right: -6,
    backgroundColor: colors.white,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 0.8,
    borderColor: colors.accent,
    paddingLeft: 1,
    paddingTop: 1,
  },

});

export default styles;
