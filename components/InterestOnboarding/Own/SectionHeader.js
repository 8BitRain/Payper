import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    backgroundColor: '#EAEAEA',
  },
  text: {
    fontSize: 13,
  },
});

class SectionHeader extends React.Component{
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.text}>{this.props.title}</Text>
      </View>
    );
  }
}

module.exports = SectionHeader
