// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import User from '../../classes/User';
import colors from '../../styles/colors';

class LoginView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      info: "Awaiting login attempt...",
      loginParams: {
        email: "freshstunna@example.com",
        password: "freshSTUNNA123!"
      }
    };

    this.User = new User({
      enableLogs:     true,
      onLoginSuccess: () => this.onLoginSuccess(),
      onLoginFailure: (res) => this.onLoginFailure(res)
    });
  }

  login() {
    this.setState({ info: "Logging in..." });
    this.User.loginWithEmail(this.state.loginParams);
  }

  onLoginSuccess() {
    console.log("this.User", this.User);
    this.setState({ info: "Success!" });
  }

  /**
    *   Potential error codes include:
    *     - auth/wrong-password
    *     - auth/user-not-found
    *     - auth/invalid-email
    *     - lambda
  **/
  onLoginFailure(errCode) {
    console.log("Error code:", errCode);
    this.setState({ info: "Failure" });
  }

  render() {
    return(
      <View style={{ flex: 1.0, backgroundColor: colors.richBlack, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.white, fontSize: 16 }}>
          { this.state.info }
        </Text>

        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={colors.richBlack}
          onPress={() => this.login()}>
          <Text style={{ color: colors.white, fontSize: 16 }}>
            Login
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}
export default LoginView;
