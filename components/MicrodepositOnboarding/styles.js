import { Dimensions } from 'react-native';
import { colors } from '../../globalStyles'
const dims = Dimensions.get('window');

const styles = {
  blur: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0
  },
  wrap: {
    flex: 1.0,
    backgroundColor: colors.snowWhiteOpaque
  },
  headerWrap: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: dims.width,
    paddingLeft: 20,
    paddingBottom: 20
  },
  submitWrap: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent
  },
  textWrap: {
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 10
  },
  inputWrap: {
    flex: 0.65,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    color: colors.deepBlue,
    textAlign: 'center'
  },
  amountWrap: {
    height: 40,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    margin: 5,
    marginRight: 0,
    padding: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  input: {
    width: 70, height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    margin: 5,
    marginLeft: 0
  }
};

module.exports = styles;
