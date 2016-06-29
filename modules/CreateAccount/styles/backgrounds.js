import {StyleSheet} from 'react-native';
import colors from "../../../styles/colors";

const backgrounds = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  email: { backgroundColor: colors.darkGrey },
  password: { backgroundColor: colors.darkGrey },
  firstName: { backgroundColor: colors.darkGrey },
  lastName: { backgroundColor: colors.darkGrey },
  phoneNumber: { backgroundColor: colors.darkGrey },
  summary: { backgroundColor: colors.darkGrey }
});

export default backgrounds;
