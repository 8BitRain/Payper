import {StyleSheet} from 'react-native';

const typography = StyleSheet.create({
  // General typography styles
  general: {
    fontFamily: "sans-serif",
    fontFamily: "Roboto",
    fontWeight: "normal",
    color: "#F4F4F9"
  },

  // Varying font sizes (ex. "What's your email?")
  fontSizeTitle: { fontSize: 15, textAlign: "center",   color: "#F4F4F9" },
  fontSizeNote: { fontSize: 10 },
  fontSizeError: { fontSize: 15},

  textInput: {
    height: 40,
    backgroundColor: "transparent",
    padding: 10,
    paddingLeft: 0,
    color: "#99ECFB"
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
