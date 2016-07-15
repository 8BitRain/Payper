import {StyleSheet, Dimensions} from 'react-native';
import colors from "../colors";

var dimensions = Dimensions.get('window');

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: '300',
    textAlign: 'center',
    color: colors.darkGrey,
  },

  input: {
    height: 42,
    width: (dimensions.width * 0.9),
    marginLeft: (dimensions.width * 0.05),
    backgroundColor: 'transparent',
    color: colors.darkGrey,
    borderColor: colors.darkGrey,
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 15,
    marginTop: 10,
  },
});

export default styles;
