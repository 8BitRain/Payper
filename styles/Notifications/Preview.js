import { StyleSheet } from 'react-native';
import colors from '../colors';

const notificationStyles = StyleSheet.create({

  // Notifications preview bubble
  numNotificationsWrap: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: colors.alertRed,
    position: 'absolute',
    bottom: 0,
    left: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Notifications preview bubble inner text
  numNotificationsText: {
    fontFamily: 'Roboto',
    fontSize: 10,
    color: colors.white,
  },

});

export default notificationStyles;
