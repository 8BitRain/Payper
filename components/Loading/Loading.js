// Dependencies
import React from 'react';
import {View, Text, Image} from "react-native";

import colors from '../../styles/colors';

class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    // Success animation, then switch to destination view
    if (this.props.complete) {

      // Progress to next page after a short delay
      if (this.props.complete) {
        setTimeout(() => {
          this.props.destination();
        }, 1000);
      }
      
      return(
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.icyBlue}}>
          <Text style={{fontFamily: 'Roboto', fontSize: 40, fontWeight: '300', color: colors.white}}>
            SUCCESS
          </Text>
        </View>
      );
    }

    // Loading animation
    else {
      return(
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.icyBlue}}>
          <Text style={{fontFamily: 'Roboto', fontSize: 40, fontWeight: '300', color: colors.white}}>
            LOADING
          </Text>
        </View>
      );
    }
  }
};

export default Loading;
