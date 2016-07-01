import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';


// StyleSheet
const styles = StyleSheet.create({
  button: {
    color: 'blue',
    marginTop: 15,
  },
  red: {
    color: 'red',
    marginBottom: 15,
    marginTop: 15,
  }
});


export default class PThree extends React.Component {
  render() {
    const prevPage = () => {
      console.log("START: prevPage (3 => 2)");
      console.log("=-=-=-=-=-=-=-=-=-=-=-=");
      Actions.pop({from: this.props.title});
    }

    return (
      <View style={{marginTop: 128, marginLeft: 20}}>
        <Text style={styles.red}>Visited by {this.props.from}</Text>
        <Text>First Name: {this.props.firstName}</Text>
        <Text>Phone Number: {this.props.phoneNumber}</Text>
        <Text style={styles.button} onPress={prevPage}>Prev page</Text>
      </View>
    )
  }
}
