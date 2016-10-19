import { Dimensions } from 'react-native';
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

const styles = {
  blur: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0
  },
  wrap: {
    flex: 1.0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  headerWrap: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: dimensions.width,
    paddingLeft: 20,
    paddingBottom: 20
  },
  submitWrap: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.alertGreen
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
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '200',
    color: colors.white,
    textAlign: 'center'
  },
  amountWrap: {
    height: 40,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    margin: 5,
    marginRight: 0,
    padding: 7,
    backgroundColor: 'rgba(150, 150, 150, 0.08)',
  },
  input: {
    width: 70, height: 40,
    backgroundColor: 'rgba(150, 150, 150, 0.03)',
    margin: 5,
    marginLeft: 0
  }
};

module.exports = styles;
