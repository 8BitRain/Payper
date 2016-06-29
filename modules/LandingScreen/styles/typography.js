import {StyleSheet} from 'react-native';
import colors from "../../../styles/colors";

const typography = StyleSheet.create({
  // General typography styles
  main: {
    fontFamily: "sans-serif",
    fontFamily: "Roboto",
    fontWeight: "300",
    color: colors.oldGrey,
  },

  // Varying font sizes (ex. "What's your email?")
  fontSizeTitle: { fontSize: 70 },
  fontSizeNote: { fontSize: 20 },
  fontSizeError: { fontSize: 15},
});


export default typography;
