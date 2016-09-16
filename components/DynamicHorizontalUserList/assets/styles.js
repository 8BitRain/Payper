// Dependencies
import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../styles/colors';

// Window dimensions
const dimensions = Dimensions.get('window');

// Should we show container borders?
const borders = true;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: dimensions.width,
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: colors.alertRed,
  },
  horizontalScrollView: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default styles;
