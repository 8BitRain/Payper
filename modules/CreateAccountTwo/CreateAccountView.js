// Dependencies
import React from 'react';
import {Actions, Router, Scene} from 'react-native-router-flux';

// Helper functions
import * as Validators from "../../helpers/validators";

// Page components
import Email from "./Pages/Email";
import Password from "./Pages/Password";
// import FirstName from "./Pages/FirstName";
// import LastName from "./Pages/LastName";
// import PhoneNumber from "./Pages/PhoneNumber";
// import Summary from "./Pages/Summary";

export default class CreateAccountView extends React.Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene
            initial={true}
            key="Email"
            component={Email}
            email={this.props.email}
            emailValidations={this.props.emailValidations}
            validate={this.props.validate}
          />
          <Scene
            key="Password"
            component={Password}
            password={this.props.password}
            passwordValidations={this.props.passwordValidations}
            validate={this.props.validate}
          />
        </Scene>
      </Router>
    )
  }
}

export default CreateAccountView;
