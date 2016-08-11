// Dependencies
import React from 'react';
import {Actions} from 'react-native-router-flux';

// Helper functions
import * as Validators from "../../helpers/validators";
var Mixpanel = require('react-native-mixpanel');

// Page components
import Email from "./Pages/Email";
import Password from "./Pages/Password";
import FirstName from "./Pages/FirstName";
import LastName from "./Pages/LastName";
import PhoneNumber from "./Pages/PhoneNumber";
import Summary from "./Pages/Summary";

const CreateAccountView = React.createClass({


  render() {
    {console.log("CreateAccountView: Origin: LandingScreenView Provider = " + this.props.provider);}
    {console.log("CreateAccountView: Origin: LandingScreenView Token = " + this.props.token);}
    if(this.props.provider == "facebook"){
      return(
      <PhoneNumber
        callbackClose={Actions.landingView}
        newUser={this.props.newUser}
        phoneValidations={this.props.phoneValidations}
        dispatchSetPhoneValidations={(text) => this.props.dispatchSetPhoneValidations(text)}
        dispatchSetPhone={this.props.dispatchSetPhone}
        dispatchSetPage={this.props.dispatchSetPage}
        dispatchSetNewUserToken={this.props.dispatchSetNewUserToken}
        dispatchSetProvider={this.props.dispatchSetProvider}
        provider={this.props.provider}
        token= {this.props.token}
      />
      )
    }
    else {
      switch (this.props.currentPage) {
        case 0:
          return(
            <Email
              callbackClose={Actions.landingView}
              email={this.props.email}
              emailValidations={this.props.emailValidations}
              dispatchSetEmailValidations={(text) => this.props.dispatchSetEmailValidations(Validators.validateEmail(text))}
              dispatchSetPage={this.props.dispatchSetPage}
            />
          )
          break;
        case 1:
          return(
            <Password
              callbackClose={Actions.landingView}
              password={this.props.password}
              passwordValidations={this.props.passwordValidations}
              dispatchSetPasswordValidations={(text) => this.props.dispatchSetPasswordValidations(Validators.validatePassword(text))}
              dispatchSetPage={this.props.dispatchSetPage}
            />
          )
          break;
        case 2:
          return(
            <FirstName
              callbackClose={Actions.landingView}
              firstName={this.props.firstName}
              firstNameValidations={this.props.firstNameValidations}
              dispatchSetFirstNameValidations={(text) => this.props.dispatchSetFirstNameValidations(Validators.validateName(text))}
              dispatchSetPage={this.props.dispatchSetPage}
            />
          )
          break;
        case 3:
          return(
            <LastName
              callbackClose={Actions.landingView}
              lastName={this.props.lastName}
              lastNameValidations={this.props.lastNameValidations}
              dispatchSetLastNameValidations={(text) => this.props.dispatchSetLastNameValidations(Validators.validateName(text))}
              dispatchSetPage={this.props.dispatchSetPage}
            />
          )
          break;
        case 4:
          return(
            <PhoneNumber
              callbackClose={Actions.landingView}
              phone={this.props.phone}
              phoneValidations={this.props.phoneValidations}
              dispatchSetPhoneValidations={(text) => this.props.dispatchSetPhoneValidations(text)}
              dispatchSetPage={this.props.dispatchSetPage}
            />
          )
          break;
        case 5:
          return(
            <Summary
              callbackClose={Actions.landingView}
              createAccount={this.props.dispatchCreateAccount}
              newUser={this.props.newUser}
              token={this.props.token}
              dispatchSetPage={this.props.dispatchSetPage}
              dispatchSetNewUserToken={this.props.dispatchSetNewUserToken}
            />
          )
          break;
      }
    }
  }
});

export default CreateAccountView;
