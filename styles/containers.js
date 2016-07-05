import {StyleSheet} from 'react-native';

const containers = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    justifyContent: "center"
  },
  justifyCenter: {
    justifyContent: "center"
  },
  padHeader: {
    paddingTop: 30
  },

  //
  whole: { flex: 1.0 },
  quox3: { flex: 0.75 },
  half: { flex: 0.5 },
  quo: { flex: 0.25 },
  sixTenths: { flex: 0.6 },


  // For testing
  borderRed: {
    borderColor: "red",
    borderWidth: 1
  }
});

export default containers;
