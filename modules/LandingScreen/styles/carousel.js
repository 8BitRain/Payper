import {StyleSheet, Dimensions} from 'react-native';
import colors from "../../../styles/colors";

var dimensions = Dimensions.get('window');

const carousel = StyleSheet.create({
  container: {
    width: dimensions.width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default carousel;
