// Dependencies
import React from 'react';
import {View, Text, Image} from "react-native";

// Custom styles
import colors from '../../styles/colors';

class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Complete == true upon success or failure
    if (this.props.complete) {

      // Success
      if (this.props.success) {
        setTimeout(() => {
          this.props.successDestination();
        }, 2000);
      }

      // Failure
      else if (!this.props.success) {
        setTimeout(() => {
          this.props.errorDestination();
        }, 2000);
      }

      // Render success or error messages
      return(
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.icyBlue}}>
          <Text style={{fontFamily: 'Roboto', fontSize: 30, fontWeight: '300', color: colors.white}}>
            {(this.props.success) ? this.props.msgSuccess : this.props.msgError }
          </Text>
        </View>
      );
    }

    // Render loading message
    else {
      return(
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.icyBlue}}>
          <Text style={{fontFamily: 'Roboto', fontSize: 30, fontWeight: '300', color: colors.white}}>
            {(this.props.msgLoading) ? this.props.msgLoading : "Loading" }
          </Text>
        </View>
      );
    }
  }
};

export default Loading;
