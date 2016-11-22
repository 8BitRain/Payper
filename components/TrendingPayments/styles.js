import { Dimensions } from 'react-native';
import {colors} from '../../globalStyles';
const dimensions = Dimensions.get('window');

const circleDims = {
  height: 64,
  width: 64
}
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
  },
  imageWrap: {
    width: circleDims.width,
    height: circleDims.height,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 12,
    marginBottom: 5,
    backgroundColor: "transparent",
    borderRadius: 64,
    borderWidth: 1,
    borderBottomColor: colors.accent,
    borderColor: colors.accent,
    shadowColor: colors.slateGrey,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
};

module.exports = styles;
