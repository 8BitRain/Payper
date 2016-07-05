import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Picker} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';

// Custom helper functions
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";

// Custom components
import Header from "../../components/Header/Header";
import ArrowNav from "../../components/Navigation/Arrows/ArrowDouble";

// Stylesheets
import backgrounds from "../../styles/backgrounds";
import containers from "../../styles/containers";
import typography from "../../styles/typography";

class CreatePaymentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      to: "",
      from: "",
      memo: "",
      frequency: "monthly",
      totalCost: "",
      eachCost: "",
      totalPayments: "",
      eachPayment: ""
    }

    this.paymentProps = {

    }

    // Props to be passed to the header
    this.headerProps = {
      types: {
        "paymentIcons": true,
        "circleIcons": false,
        "settingsIcon": false,
        "closeIcon": true
      },
      index: 0,
      numCircles: null
    };

   // Callback functions to be passed to the header
   this.callbackClose = function() { Actions.pop() };
  }

  // Picker functionality
  onValueChange(key, value) {
    this.setState({
      frequency: key,
    });
  }

  render() {
    return(
      <View style={[containers.container, backgrounds.white]}>

        { /* Test */ }
        <View style={[containers.container, containers.justifyCenter, containers.padHeader, backgrounds.email]}>

          { /* Who? */ }
          <Text style={[typography.general, typography.fontSizeNote, typography.marginSides]}>Who&#39;s getting coin?</Text>
          <TextInput
            style={[typography.textInput, typography.marginSides, typography.marginBottom]}
            autoCorrect={false}
            autoFocus={true}
            placeholderFontFamily="Roboto"
            placeholderTextColor="#b6b6b6"
            placeholder={"John Doe"}
            onChangeText={(text) => {this.state.to = text; console.log(this.state)}} />

          { /* What for? */ }
          <Text style={[typography.general, typography.fontSizeNote, typography.marginSides]}>What for?</Text>
          <TextInput
            style={[typography.textInput, typography.marginSides, typography.marginBottom]}
            autoCorrect={false}
            placeholderFontFamily="Roboto"
            placeholderTextColor="#b6b6b6"
            placeholder={"Toilet paper"}
            onChangeText={(text) => {this.state.memo = text; console.log(this.state)}} />

          { /* Frequency */ }
          <Text style={[typography.general, typography.fontSizeNote, typography.marginSides]}>How often</Text>
          <Picker
             selectedValue={this.state.frequency}
             onValueChange={this.onValueChange.bind(this)}>
             <Picker.Item label="Monthly" value="monthly" />
             <Picker.Item label="Weekly" value="weekly" />
             <Picker.Item label="Yearly" value="yearly" />
           </Picker>

        </View>



        { /* Header */ }
        <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
      </View>
    );
  }
}

export default CreatePaymentView;
