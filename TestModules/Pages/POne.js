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


export default class POne extends React.Component {
  constructor(props) {
    super(props);

    this.setFirstName = function(name) { this.props.setFirstName(name) }
  }

  render() {
    const nextPage = () => {
      console.log("START: nextPage (1 => 2)");
      console.log("=-=-=-=-=-=-=-=-=-=-=-=");
      Actions.PTwo({from: this.props.title});
    }

    const setName = () => {
      this.props.setFirstName("NameP1");
    }

    return (
      <View style={{marginTop: 128, marginLeft: 20}}>
        <Text style={styles.red}>Visited by {this.props.from}</Text>
        <Text>First Name: {this.props.firstName}</Text>
        <Text>Phone Number: {this.props.phoneNumber}</Text>
        <Text style={styles.button} onPress={nextPage}>Next page</Text>
        <Text style={styles.button} onPress={() => { this.setFirstName("NameP1") }}>Change first name</Text>
      </View>
    )
  }
}
