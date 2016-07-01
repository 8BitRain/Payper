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


export default class PTwo extends React.Component {
  render() {
    const nextPage = () => {
      console.log("START: nextPage (2 => 3)");
      console.log("=-=-=-=-=-=-=-=-=-=-=-=");
      Actions.PThree({from: this.props.title});
    }

    const prevPage = () => {
      console.log("START: prevPage (2 => 1)");
      console.log("=-=-=-=-=-=-=-=-=-=-=-=");
      Actions.pop({from: this.props.title});
    }

    return (
      <View style={{marginTop: 128, marginLeft: 20}}>
        <Text style={styles.red}>Visited by {this.props.from}</Text>
        <Text>First Name: {this.props.firstName}</Text>
        <Text>Phone Number: {this.props.phoneNumber}</Text>
        <Text style={styles.button} onPress={nextPage}>Next page</Text>
        <Text style={styles.button} onPress={prevPage}>Prev page</Text>
      </View>
    )
  }
}
