import { Dimensions } from 'react-native'
import { colors } from '../../globalStyles'
const dims = Dimensions.get('window')

const styles = {
  wrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    width: dims.width * 0.94,
    padding: 10,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 10,
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0.25,
      width: 0.25
    }
  },
  text: {
    fontSize: 18,
    color: colors.snowWhite,
    padding: 2
  }
}

module.exports = styles
