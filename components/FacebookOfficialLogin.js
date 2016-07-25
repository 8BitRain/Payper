import React from 'react';
import {View, Text, StyleSheet, Dimensions} from "react-native";
import {Actions} from "react-native-router-flux";
//const FBSDK = require('react-native-fbsdk');
import {LoginButton, AccessToken} from 'react-native-fbsdk';


class FacebookOfficialLogin extends React.Component{
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <View>
        <LoginButton/>
      </View>
    );
  }
};

export default FacebookOfficialLogin;
