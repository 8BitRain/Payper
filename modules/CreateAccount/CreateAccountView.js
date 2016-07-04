// Dependencies
import React from 'react';
import {Actions, Router, Scene} from 'react-native-router-flux';

// Helper functions
import * as Validators from "../../helpers/validators";

// Page components
import Email from "./Pages/Email";
import Password from "./Pages/Password";
import FirstName from "./Pages/FirstName";
import LastName from "./Pages/LastName";
import PhoneNumber from "./Pages/PhoneNumber";
import Summary from "./Pages/Summary";

export default class CreateAccountView extends React.Component {
  render() {
    console.log(this.props.emailValidations);
    return (
      <Router>
        <Scene
          key="Email"
          component={Email}
          initial={true}
          emailValidations={this.props.emailValidations}
          dispatchSetEmailValidations={this.props.dispatchSetEmailValidations}
          dispatchSetPage={this.props.dispatchSetPage}
        />
      </Router>
    )
  }
}

export default CreateAccountView;
