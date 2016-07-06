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
      inputting: "frequency",

      // Payment props
      to: "",
      from: "",
      memo: "",
      frequency: "month",
      totalCost: "",
      eachCost: "",
      totalPayments: "",
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

          <View style={[containers.container, {backgroundColor: colors.darkGrey}]}>
            <View style={containers.padHeader}>
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

          <View style={[containers.container, {backgroundColor: colors.darkGrey}]}>
            <View style={containers.padHeader}>

              { /* Prompt */ }
              <View style={[{flex: 0.2, flexDirection: "row", justifyContent: "center"}]}>
                <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, {color: colors.white}]}>
                  {this.state.to} is getting paid
                </Text>
              </View>

              { /* Input */ }
              <View style={[{flex: 1, alignItems: "center", paddingTop: 45}]}>

                <View style={[{flexDirection: "row", justifyContent: "center"}]}>
                  <TextInput
                    style={[typography.costInput, {width: 100}]}
                    placeholder={"$5.00"}
                    onChangeText={(num) => { this.setState({eachCost: num}); }}
                    keyboardType={"decimal-pad"}
                    autoFocus={true} />
                  <Text style={[typography.costInput, {padding: 0, height: 40}]}>
                    per
                  </Text>
                </View>

                <Picker
                  style={typography.picker}
                  itemStyle={typography.pickerItem}
                  selectedValue={this.state.frequency}
                  onValueChange={(freq) => this.setState({frequency: freq})}>
                  <Picker.Item label="year" value="yearly" />
                  <Picker.Item label="month" value="monthly" />
                  <Picker.Item label="week" value="weekly" />
                </Picker>
              </View>


              { /* Filler */ }
              <View style={[{flex: 0.2}]} />
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
