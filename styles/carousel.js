import {StyleSheet, Dimensions} from 'react-native';
import colors from "./colors";

var dimensions = Dimensions.get('window');

const carousel = StyleSheet.create({
  container: {
    width: dimensions.width,
    flex: .5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default carousel;
