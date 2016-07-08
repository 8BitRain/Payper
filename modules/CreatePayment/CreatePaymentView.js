import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Picker, AsyncStorage, Dimensions, DeviceEventEmitter} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';

// Custom helper functions
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as db from "../../helpers/db";

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
      // Keeps track of pagination
      inputting: "name",

      // Payment props
      to: "",
      from: "",
      memo: "",
      frequency: "weekly",
      totalCost: "",
      eachCost: "",
      totalPayments: "",
      completedPayments: "0",

      // Storage for predictive user search
      allUsers: {},
      filteredUsers: [],
      filtered: false,

      // Hack for resizing TextInput for cost to be the width of the text it contains
      costInputWidth: 120,

      // Props to be passed to the arrow nav
      arrowNavProps: {
        left: false,
        right: true,
      },

      // Props to be passed to the header
      headerProps: {
        types: {
          "paymentIcons": true,
          "circleIcons": false,
          "settingsIcon": false,
          "closeIcon": true,
        },
        index: 0,
        numCircles: null,
      },

      // Used to reposition view around keyboard
      kbHeight: 0,
      vpHeight: 0,
    }

     // Callback functions to be passed to the header
     this.callbackClose = function() { Actions.pop() };

     // TODO: Dynamically populate this with our user Firebase
     this.allUsers = ["@Brady-Sheridan", "@Mohsin-Khan", "@Vash-Marada"];
    //  this.getAllUsers(function(users) {
    //    this.test = users;
    //  });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      inputting: nextProps.inputting,
      to: nextProps.to,
      from: nextProps.from,
      memo: nextProps.memo,
      frequency: nextProps.frequency,
      totalCost: nextProps.totalCost,
      eachCost: nextProps.eachCost,
      totalPayments: nextProps.totalPayments,
      completedPayments: nextProps.completedPayments,
      filteredUsers: nextProps.filteredUsers,
      allUsers: nextProps.allusers,
      filteredUsers: nextProps.filteredUsers,
      filtered: nextProps.filtered,
      costInputWidth: nextProps.costInputWidth,
      arrowNavProps: nextProps.headerProps,
      headerProps: nextProps.headerProps,
      kbHeight: nextProps.kbHeight,
    });
  }

  filterUsers(filter) {
    var re = new RegExp(filter + '.+$', 'i');
    var users = this.allUsers.filter(function(e, i, a){
      return e.search(re) != -1;
    });
    this.setState({filteredUsers: users});
    if (users.length < this.allUsers.length) {
      this.setState({filtered: true});
    } else {
      this.setState({filtered: false});
    }
  }

  // async getAllUsers(callback) {
  //   await db.returnAllUsers(function(users) {
  //     console.log(users);
  //   });
  // }

  resizeTextInput() {
    console.log("testing");
    this.refs.costInputClone.measure((ox, oy, width, height) => {
      width += 25;
      this.setState({costInputWidth: width});
    });
  }

  componentDidMount() {
    _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => { this.setState({kbHeight: e.endCoordinates.height}); });
    _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => { this.setState({kbHeight: e.endCoordinates.height}); });
  }

  render() {

    // console.log(Dimensions.get('keyboard').width);

    switch (this.state.inputting) {
      case "name":
        return(

          <View style={[containers.container, {backgroundColor: colors.darkGrey}]}>
            <View style={containers.padHeader}>
              { /* Input */ }
              <View>
                <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, {color: colors.white}]}>Who&#39;s getting paid?</Text>
                <TextInput
                  style={[typography.textInput, typography.marginSides, typography.marginBottom, {color: colors.white, paddingLeft: 0}]}
                  placeholder={"John Doe"}
                  autoFocus={true}
                  defaultValue={this.state.to}
                  onChangeText={(text) => { this.filterUsers(text); }} />

                <Text style={[typography.textInput, typography.marginSides, typography.marginBottom, {color: colors.white}]}>
                  { (this.state.filtered) ? this.state.filteredUsers : null }
                </Text>
              </View>
            </View>

            { /* Header */ }
            <Header callbackClose={() => {this.callbackClose()}} headerProps={this.state.headerProps} />

            { /* Arrow nav buttons */ }
            <View style={{position: 'absolute', bottom: this.state.kbHeight, left: 0, right: 0}}>
              <ArrowNav
              arrowNavProps={this.state.arrowNavProps}
              callbackRight={() => { this.setState({inputting: "frequency", arrowNavProps: {left: true, right: true} }); }} />
            </View>
          </View>

        );
      break;
      case "frequency":
        return(

          <View style={[containers.container, {backgroundColor: colors.darkGrey}]}>
            <View style={containers.padHeader}>

              { /* Hidden (off-screen) element that is measured and used to resize TextInput for cost input */ }
              <Text
                style={[typography.costInput, {position: 'absolute', top: -1000, left: -1000}]}
                ref="costInputClone">
                {this.state.eachCost}
              </Text>

              { /* Prompt */ }
              <View style={[{flex: 0.2, flexDirection: "row", justifyContent: "center"}]}>
                <Text style={[typography.general, typography.fontSizeTitle, typography.marginSides, {color: colors.white}]}>
                  {this.state.to} is getting paid
                </Text>
              </View>

              { /* Input */ }
              <View style={[{flex: 1, alignItems: "center", paddingTop: 45}]}>

                <View style={[{flexDirection: "row", justifyContent: "center"}]}>
                  <Text style={[typography.costInput, {padding: 0, height: 40}]}>
                    $
                  </Text>
                  <TextInput
                    style={[typography.costInput, {width: this.state.costInputWidth, textAlign: 'center'}]}
                    placeholder={"5.00"}
                    onChangeText={(num) => { this.setState({eachCost: num}); }}
                    keyboardType={"decimal-pad"}
                    autoFocus={true} />
                  <Text style={[typography.costInput, {padding: 0, height: 40}]}>
                    per month.
                  </Text>
                </View>

                { /*
                <Picker
                  style={typography.picker}
                  itemStyle={typography.pickerItem}
                  selectedValue={this.state.frequency}
                  onValueChange={(freq) => this.setState({frequency: freq})}>
                  <Picker.Item label="year" value="yearly" />
                  <Picker.Item label="month" value="monthly" />
                  <Picker.Item label="week" value="weekly" />
                </Picker>
                */ }
              </View>

              { /* Arrow nav buttons */ }
              <View style={containers.padHeader}>
                <ArrowNav
                arrowNavProps={this.state.arrowNavProps}
                callbackRight={() => { this.setState({inputting: "frequency", arrowNavProps: {left: true, right: true} }); }}
                callbackLeft={() => { this.setState({inputting: "name", arrowNavProps: {left: false, right: true} }); }} />
              </View>


              { /* Filler */ }
              <View style={[{flex: 0.2}]} />
            </View>

            { /* Header */ }
            <Header callbackClose={() => {this.callbackClose()}} headerProps={this.state.headerProps} />
          </View>

        );
      break;
    }

    console.log("INPUTTING: " + this.state.inputting);
  }
}

export default CreatePaymentView;
