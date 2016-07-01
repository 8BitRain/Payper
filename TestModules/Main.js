import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Router, Scene, Actions } from 'react-native-router-flux';

// Custom components
import POne from './Pages/POne';
import PTwo from './Pages/PTwo';
import PThree from './Pages/PThree';

export default class Main extends Component {
  constructor(props) {
    super(props);

    // Set initial state
    this.state = {
      firstName: "DefaultFirstName",
      phoneNumber: "DefaultPhoneNumber",
    }

    // Sets phone number in local state
    function setPhoneNumber(num) {
      console.log("STARTED: setPhoneNumber");
      console.log("=-=-=-=-=-=-=-=-=-=-=");
      this.state.phoneNumber = num;
    }

    // Sets first name in local state
    this.setFirstName = function(name) {
      console.log("STARTED: setFirstName");
      console.log("=-=-=-=-=-=-=-=-=-=-=");
      console.log("received name " + name);
      this.state.firstName = name;
    }
  }

  render() {
    return (
      <Router>
        <Scene key="POne" component={POne} title="Page One" initial={true} test={() => {console.log("=-=-= test =-=-=")}} setFirstName={() => { this.setFirstName(firstName) }} firstName="Name" setPhoneNumber={this.setPhoneNumber} />
        <Scene key="PTwo" component={PTwo} title="Page Two" setFirstName={this.setFirstName} setPhoneNumber={this.setPhoneNumber} />
        <Scene key="PThree" component={PThree} title="Page Three" setFirstName={this.setFirstName} setPhoneNumber={this.setPhoneNumber} />
      </Router>
    )
  }
}
