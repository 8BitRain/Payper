import {StyleSheet} from 'react-native';
import colors from "../../../styles/colors";

const typography = StyleSheet.create({
  // General typography styles
  general: {
    fontFamily: "sans-serif",
    fontFamily: "Roboto",
    fontWeight: "100",
    color: "#F4F4F9",
    alignSelf: "center",
    fontSize: 20
  },

  title: {
    fontFamily: "Roboto",
    fontWeight: "100",
    color: colors.accent,
    alignSelf: "center",
    fontSize: 30
  },

  // Varying font sizes (ex. "What's your email?")
  fontSizeTitle: { fontSize: 20,  color: "#F4F4F9" },
  fontSizeNote: { fontSize: 10,  },
  fontSizeError: { fontSize: 15},

  textInput: {
    height: 60,
    width: 224,
    backgroundColor: colors.obsidianInput,
    paddingLeft: 0,
    color: "#99ECFB",
    fontFamily: "Roboto",
    fontWeight: "100",
    fontSize: 15,
    color: colors.white,
    textAlign: "center",
    alignSelf: "center"
  },

  stateInput: {
    height: 200,
    color: "black",
    fontSize: 25,

  },

  stateInput2: {
    height: 450,
    color: "black",
    fontSize: 25,
    marginBottom: 0
  },


  // Helper styles
  marginLeft: { marginLeft: 20 },
  marginBottom: { marginBottom: 10 },
  marginTop: { marginBottom: 10 },
  marginRight: { marginBottom: 20 },
  marginSides: {
    marginLeft: 20,
    marginRight: 20
  },
  padLeft: { paddingLeft: 20 },
  padBottom: { paddingBottom: 10 },
  padTop: { paddingBottom: 10 },
  padRight: { paddingBottom: 20 }
});

const validation = StyleSheet.create({
  contentContainer : {
    flex: 0.5
  }
});

export default typography;
