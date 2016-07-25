// Dependencies
import { StyleSheet, Dimensions } from 'react-native';
import colors from '../colors';

const styles = StyleSheet.create({
  // Row wrapper
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },

  // Row title text
  rowTitle: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.white,
    marginLeft: 20,
  },

  // Row icon
  icon: {
    marginLeft: 20,
  },
});

export default styles;
