// Dependencies
import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../styles/colors';

// Window dimensions
const dimensions = Dimensions.get('window');

// Should we show container borders?
const borders = false;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: dimensions.width,
    borderWidth: (borders) ? 1.0 : 0.0,
    borderColor: colors.alertRed,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  horizontalScrollView: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default styles;
