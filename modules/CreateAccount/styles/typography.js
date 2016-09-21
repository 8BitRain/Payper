import {StyleSheet} from 'react-native';
import colors from "../../../styles/colors";

const typography = StyleSheet.create({
  // General typography styles
  general: {
    fontFamily: "sans-serif",
    fontFamily: "Roboto",
    fontWeight: "100",
    color: "#F4F4F9",
    alignSelf: "center"
  },

  validationSuccess: {
    fontFamily: "sans-serif",
    fontFamily: "Roboto",
    fontWeight: "100",
    color: colors.accent,
    alignSelf: "center"
  },

  // Varying font sizes (ex. "What's your email?")
  fontSizeTitle: { fontSize: 25 },
  fontSizeNote: { fontSize: 20 },
  fontSizeError: { fontSize: 15},

  textInput: {
    height: 60,
    width: 224,
    backgroundColor: colors.obsidianInput,
    paddingLeft: 0,
    color: "#99ECFB",
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "100",
    color: colors.white,
    textAlign: "center",
    alignSelf: "center"
  },

  // Helper styles
  marginLeft: { marginLeft: 20 },
  marginBottom: { marginBottom: 20 },
  marginTop: { marginBottom: 20 },
  marginRight: { marginBottom: 20 },
  marginSides: {
    marginLeft: 20,
    marginRight: 20
  },
  padLeft: { paddingLeft: 20 },
  padBottom: { paddingBottom: 20 },
  padTop: { paddingBottom: 20 },
  padRight: { paddingBottom: 20 }
});

const validation = StyleSheet.create({
  contentContainer : {
    flex: 0.5
  }
});

export default typography;
