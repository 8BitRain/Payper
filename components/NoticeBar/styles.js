import { Dimensions } from 'react-native';
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

const styles = {
  wrap: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: dimensions.width,
    backgroundColor: colors.richBlack
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '200',
    color: colors.white,
    paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15,
    textAlign: 'center'
  }
};

module.exports = styles;
