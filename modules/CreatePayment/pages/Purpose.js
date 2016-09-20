// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Stylesheets
import colors from '../../../styles/colors';

const dimensions = Dimensions.get('window');

class Purpose extends React.Component {
  constructor(props) {
    super(props);
    console.log("Constructing Purpose...");
  }

  render() {
    return(
      <View style={styles.wrap}>
        <Text onPress={() => this.props.prevPage()}>
          Prev
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1.0,
    width: dimensions.width,
    backgroundColor: colors.alertYellow,
  }
});

export default Purpose;
