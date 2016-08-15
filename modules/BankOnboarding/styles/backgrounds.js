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
  email: { backgroundColor: colors.richBlack },
  password: { backgroundColor: colors.richBlack },
  firstName: { backgroundColor: colors.richBlack },
  lastName: { backgroundColor: colors.richBlack },
  phoneNumber: { backgroundColor: colors.richBlack },
  summary: { backgroundColor: colors.richBlack }
});

export default backgrounds;
