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
import colors from "../../styles/colors";

class CreatePaymentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputting: "name",

      // Payment props
      to: "Brady",
      from: "",
      memo: "",
      frequency: "month",
      totalCost: "120",
      eachCost: "10",
      totalPayments: "12",
      completedPayments: "0"
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

   // Props to be passed to the arrow nav
   this.arrowNavProps = {
     left: false,
     right: true
   };

   // Callback functions to be passed to the arrow nav
   this.onPressRight = function() { console.log("next page"); };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      inputting: nextProps.inputting,
      to: nextProps.to,
    });
  }

  render() {

    //
    switch (this.state.inputting) {
      case "name":
        return(

          <View style={[containers.container]}>

            { /* Summary
            <View style={[{flex: 0.15}, containers.padHeader, {backgroundColor: colors.white}]}>
              <Text
                style={[typography.general, typography.fontSizeNote, typography.marginSides, {color: colors.darkGrey}]}>
                ____ is getting paid ___ per ___ for ___.
              </Text>
            </View>
            */ }

            <View style={[{flex: 0.85, backgroundColor: colors.darkGrey}, containers.padHeader]}>
              { /* Input */ }
              <View>
                <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, {color: colors.white}]}>Who&#39;s getting paid?</Text>
                <TextInput
                  style={[typography.textInput, typography.marginSides, typography.marginBottom, {color: colors.white}]}
                  placeholder={"John Doe"}
                  onChangeText={(text) => { this.setState({to: text}); }} />

                <Text style={[typography.textInput, typography.marginSides, typography.marginBottom, {color: colors.white}]}>
                  {this.state.to}
                </Text>

                  { /* Arrow nav buttons */ }
                  <View style={containers.padHeader}>
                    <ArrowNav
                    arrowNavProps={this.arrowNavProps}
                    callbackRight={() => { this.setState({inputting: "frequency"}); }} />
                  </View>
              </View>
            </View>

            { /* Header */ }
            <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
          </View>

        );
      break;
      case "frequency":
        return(

          <View style={[containers.container]}>

            { /* Summary
            <View style={[{flex: 0.15}, containers.padHeader, {backgroundColor: colors.white}]}>
              <Text
                style={[typography.general, typography.fontSizeNote, typography.marginSides, {color: colors.darkGrey}]}>
                ____ is getting paid ___ per ___ for ___.
              </Text>
            </View>
            */ }

            <View style={[{flex: 0.85, backgroundColor: colors.darkGrey}, containers.padHeader]}>
              { /* Input */ }
              <View>
                <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, {color: colors.white}]}>Who&#39;s getting paid?</Text>
                <TextInput
                  style={[typography.textInput, typography.marginSides, typography.marginBottom, {color: colors.white}]}
                  placeholder={"John Doe"}
                  onChangeText={(text) => { this.setState({to: text}); }} />

                <Text style={[typography.textInput, typography.marginSides, typography.marginBottom, {color: colors.white}]}>
                  {this.state.to}
                </Text>

                  { /* Arrow nav buttons */ }
                  <View style={containers.padHeader}>
                    <ArrowNav
                    arrowNavProps={this.arrowNavProps}
                    callbackRight={() => { console.log(this.state) }} />
                  </View>
              </View>
            </View>

            { /* Header */ }
            <Header callbackClose={() => {this.callbackClose()}} headerProps={this.headerProps} />
          </View>

        );
      break;
    }

    console.log("INPUTTING: " + this.state.inputting);
  }
}

export default CreatePaymentView;
