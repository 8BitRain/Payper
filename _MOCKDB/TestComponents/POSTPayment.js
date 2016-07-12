// Dependencies
import React from 'react';
import {View, Button, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';

// Stylesheets
import backgrounds from "../../styles/backgrounds";
import containers from "../../styles/containers";
import typography from "../../styles/typography";

class POSTPayment extends React.Component {
  constructor(props) {
    super(props);

    this.testPayment = {
      "to": "isajf-12341-jafj1-asdj1",
      "from": "vmoa0-fkakj-4d0ia-dka01",
      "memo": "Spotify",
      "frequency": "monthly",
      "totalCharge": 60,
      "eachCharge": 5,
      "totalPayments": 12,
      "completedPayments": 0
    }

    this.sendPayment = function(data) {
      var url = "https://m4gh555u28.execute-api.us-east-1.amazonaws.com/dev/payments/create";

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
        <Text onPress={() => this.sendPayment(this.testPayment)}>Send test payment POST request</Text>
      </View>
    );
  }
};

export default POSTPayment;
