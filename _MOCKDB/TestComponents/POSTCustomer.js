// Dependencies
import React from 'react';
import {View, Button, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';

// Stylesheets
import backgrounds from "../../styles/backgrounds";
import containers from "../../styles/containers";
import typography from "../../styles/typography";

class POSTCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.testCustomer = {
      "firstName": "Brady",
      "lastName": "Sheridan",
      "email": "brady.sherid@gmail.com",
      "ipAddress": "192.391.0.0",
      "type": "-",
      "address1": "-",
      "address2": "-",
      "city": "-",
      "state": "-",
      "postalCode": "-",
      "dateOfBirth": "-",
      "ssn": "-",
      "phone": "-"
    }

    this.sendCustomer = function(data) {
      var url = "https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/customer/create";

      fetch(url, {method: "POST", body: JSON.stringify({data})})
      .then((response) => response.json())
      .then((responseData) => {
        console.log("POST response:");
        console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        console.log(responseData);
      })
      .done();
    }
  }
  render() {
    return(
      <View style={[containers.container, backgrounds.email, {justifyContent: "center", alignItems: "center"}]}>
        <Text onPress={() => this.sendCustomer(this.testCustomer)}>Send test customer POST request</Text>
      </View>
    );
  }
};

export default POSTCustomer;
