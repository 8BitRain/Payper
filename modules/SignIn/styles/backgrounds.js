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
  password: { backgroundColor: colors.obsidian },
  firstName: { backgroundColor: colors.obsidian },
  lastName: { backgroundColor: colors.obsidian },
  phoneNumber: { backgroundColor: colors.obsidian },
  summary: { backgroundColor: colors.obsidian }
});

export default backgrounds;
