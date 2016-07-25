// Dependencies
import React from 'react';
import {View, Text, Image} from "react-native";

// Helper functions
import * as Init from '../../_init';

// Custom styles
import colors from '../../styles/colors';

class SplashView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    Init.signInWithToken(function(signedIn) {
      console.log("Signed in: " + signedIn);
    });
  }

  render() {
    return(
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.icyBlue}}>
        <Text style={{fontFamily: 'Roboto', fontSize: 20, fontWeight: '300', color: colors.white}}>
          Coincast
        </Text>
      </View>
    );
  }
};

export default SplashView;
