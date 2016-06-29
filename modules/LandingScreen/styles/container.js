import {StyleSheet} from 'react-native';

const container = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Flexbox sizes
  whole: { flex: 1.0 },
  quox3: { flex: 0.75 },
  sixTenths: { flex: 0.6 },
  twoTenths: { flex: 0.2 },
  half: { flex: 0.5 },
  third: { flex: 0.33 },
  quo: { flex: 0.25 },

  // Flexbox directions
  col: { flexDirection: 'column' },
  row: { flexDirection: 'row' },

  // For testing
  borderRed: {
    borderColor: "red",
    borderWidth: 1,
  },
});

export default container;
