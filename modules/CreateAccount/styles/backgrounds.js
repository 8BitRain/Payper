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
  email: { backgroundColor: colors.obisdian },
  password: { backgroundColor: colors.obisdian },
  firstName: { backgroundColor: colors.obisdian },
  lastName: { backgroundColor: colors.obisdian },
  phoneNumber: { backgroundColor: colors.obisdian },
  summary: { backgroundColor: colors.obisdian }
});

export default backgrounds;
