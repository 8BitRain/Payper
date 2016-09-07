import {StyleSheet} from 'react-native';

const containers = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center"
  },
  justifyCenter: {
    justifyContent: "center"
  },
  padHeader: {
    paddingTop: 100
  },
  padHeaderSubSize_1: {
    paddingTop: 80
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
  },

  textArrowContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  paymentContainer: {
    /*flexDirection: "column",*/
    flex: .25,
    alignItems: "center",
    justifyContent: "flex-end",
    bottom: 5
  }
});

export default containers;
