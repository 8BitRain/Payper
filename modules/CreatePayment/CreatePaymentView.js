import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Picker, AsyncStorage, Dimensions, DeviceEventEmitter, TouchableHighlight} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';

// Custom helper functions
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as db from "../../helpers/db";

// Custom components
import Header from "../../components/Header/Header";
import ArrowNav from "../../components/Navigation/Arrows/ArrowDouble";
import PayRequestNav from "../../components/Navigation/PayRequest/PayRequest";
import UserPreview from "../../components/Previews/User/User";
import Loading from "../../components/Loading/Loading";

// Stylesheets
import backgrounds from "../../styles/backgrounds";
import containers from "../../styles/containers";
import typography from "../../styles/typography";
import colors from "../../styles/colors";

// Used to size user previews
var dimensions = Dimensions.get('window');

class CreatePaymentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Keeps track of pagination
      inputting: "name",

      // Payment props
      to: "",
      currentUser: {},
      user: {},
      memo: "",
      frequency: "monthly",
      totalCost: "",
      eachCost: "",
      totalPayments: "",
      completedPayments: "0",
      cashFlow: "",

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
    }

    this.kbOffset = new Animated.Value(0);

     // Callback functions to be passed to the header
     this.callbackClose = function() { Actions.pop() };

     // Firebase => AynscStorage => this.allUsers[]
     this.allUsers = [];

     // Get current user and store it in our state
     try {
       AsyncStorage.getItem('@Store:user').then(function(val) {
         this.setState({currentUser: val});
         console.log("=-=-= SET CURRENT USER TO: ");
         console.log(this.state.currentUser);
       }.bind(this));
     } catch (err) {
       console.log("=-=-= ERROR GETTING USER FROM ASYNC STORAGE =-=-=");
       console.log(err);
     }

     // Get session token and store it in our state
     try {
       AsyncStorage.getItem('@Store:session_key').then(function(val) {
         this.setState({sessionToken: val});
         console.log("=-=-= SET SESSION TOKEN IN STATE TO: ");
         console.log(this.state.sessionToken.substring(this.state.sessionToken.length - 5, this.state.sessionToken.length));
       }.bind(this));
     } catch (err) {
       console.log("=-=-= ERROR GETTING SESSION TOKEN FROM ASYNC STORAGE =-=-=");
       console.log(err);
     }

     // Get user list and store it in our state
     try {
       AsyncStorage.getItem('@Store:users').then(function(users) {
         users = JSON.parse(users);
         for (var i in users) {
           users[i].username = i;
           this.allUsers.push(users[i]);
         }
       }.bind(this));
     } catch (err) {
       console.log("=-=-= ERROR GETTING USERS FROM ASYNC STORAGE =-=-=");
       console.log(err);
     }
   }

   componentWillReceiveProps(nextProps) {
     this.setState({
       inputting: nextProps.inputting,
       to: nextProps.to,
       user: nextProps.user,
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
       sessionToken: nextProps.sessionToken,
     });
   }

   filterUsers(filter) {
     if (filter == "" || filter == "-" || filter == "@") {
       this.setState({filteredUsers: []});
     } else {
       // Generate regex with user's input
       var re = new RegExp(filter + '.+$', 'i');

       // Get users that match this filter
       var users = this.allUsers.filter(function(e, i, a) {
         return e.username.search(re) != -1;
       });

       // Update state resulting in re-render of user previews
       this.setState({filteredUsers: users});
     }
   }

   // Return user preview components for each filtered user
   getUserPreviews() {
     var previews = [];
     for (var i = 0; i < this.state.filteredUsers.length; i++) {
       var currUser = this.state.filteredUsers[i];
       previews.push(
         <UserPreview
            key={currUser.username}
            user={currUser}
            width={dimensions.width * 0.9}
            callback={() => { this.setState({to: currUser.username, user: currUser}); }} />
      );
    };
    return previews;
   };

  // Return user preview for the specified user
  getUserPreview(user) {
    return(
      <UserPreview
        key={user.username}
        user={user}
        width={dimensions.width}
        callback={() => { this.setState({to: user.username}); }} />
    );
  };

  createPayment(flow) {

    // Pass down scope
    var _this = this;

    // Start loading animation
    this.setState({loading: true});

    var currUser = JSON.parse(this.state.currentUser);
    if (flow == 'in') {
      this.props.dispatchCreatePayment({
        amount: this.state.eachCost,
        purpose: this.state.memo,
        payments: this.state.totalPayments,
        recip_id: currUser.uid,
        recip_name: currUser.first_name + " " + this.state.currentUser.last_name,
        recip_pic: currUser.profile_pic,
        sender_id: this.state.user.uid,
        sender_name: this.state.user.first_name + " " + this.state.user.last_name,
        sender_pic: this.state.user.pic,
        confirmed: false,
        type: "request",
        token: this.state.sessionToken,
      }, function() {
        _this.setState({doneLoading: true});
      });
    } else if (flow == 'out') {
      this.props.dispatchCreatePayment({
        amount: this.state.eachCost,
        purpose: this.state.memo,
        payments: this.state.totalPayments,
        recip_id: this.state.user.uid,
        recip_name: this.state.user.first_name + " " + this.state.user.last_name,
        recip_pic: this.state.user.profile_pic,
        sender_id: currUser.uid,
        sender_name: currUser.first_name + " " + currUser.last_name,
        sender_pic: currUser.profile_pic,
        confirmed: true,
        type: "pay",
        token: this.state.sessionToken,
      }, function() {
        _this.setState({doneLoading: true});
      });
    }
  };

  // resizeTextInput() {
  //   console.log("testing");
  //   this.refs.costInputClone.measure((ox, oy, width, height) => {
  //     width += 25;
  //     this.setState({costInputWidth: width});
  //   });
  // }

  _keyboardWillShow(e) {
    Animated.spring(this.kbOffset, {
      toValue: e.endCoordinates.height,
      friction: 6
    }).start();
  }

  _keyboardWillHide(e) {
    Animated.spring(this.kbOffset, {
      toValue: 0,
      friction: 6
    }).start();
  }

  /**
    *   Add keyboard measuring event listeners
  **/
  componentDidMount() {
    _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
  }

  /**
    *   Remove keyboard measuring event listeners
  **/
  componentWillUnmount() {
    _keyboardWillShowSubscription.remove();
    _keyboardWillHideSubscription.remove();
  }


  render() {

    switch (this.state.inputting) {

      // User is inputting name of other party
      case "name":
        return(

          <View style={[containers.container, {backgroundColor: colors.darkGrey}]}>
            <View style={containers.padHeader}>
              { /* Input */ }
              <View>
                <Text style={[typography.general, typography.fontSizeNote, typography.marginSides, {color: colors.white}]}>Who are you splitting with?</Text>
                <TextInput
                  style={[typography.textInput, typography.marginSides, {width: (dimensions.width * 0.9), backgroundColor: colors.white, color: colors.darkGrey, paddingLeft: 15, marginTop: 10}]}
                  placeholder={"John Doe"}
                  autoFocus={true}
                  defaultValue={this.state.to}
                  onChangeText={(text) => { this.filterUsers(text); this.setState({to: text}); }} />

                { /* Separator */ }
                <View style={{height: 2.0, backgroundColor: 'transparent'}}></View>

                { /* Dynamically populated user previews */ }
                <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                  { this.getUserPreviews() }
                </View>
              </View>
            </View>

            { /* Header */ }
            <Header callbackClose={() => {this.callbackClose()}} headerProps={this.state.headerProps} />

            { /* Arrow nav buttons */ }
            <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
              <ArrowNav
              arrowNavProps={this.state.arrowNavProps}
              callbackRight={() => { this.setState({inputting: "frequency", arrowNavProps: {left: true, right: true} }); }} />
            </Animated.View>
          </View>

        );
      break;

      // User is inputting cost and number of payments
      case "frequency":
        return(

          <View style={[containers.container, {backgroundColor: colors.white}]}>
            <View style={containers.padHeader}>

              { /* Hidden (off-screen) element that is measured and used to resize TextInput for cost input */ }
              <Text
                style={[typography.costInput, {position: 'absolute', top: -1000, left: -1000}]}
                ref="costInputClone">
                {this.state.eachCost}
              </Text>

              { /* User preview for the user we are paying or requesting  */ }
              { this.getUserPreview(this.state.user) }

              { /* Input */ }
              <View style={[{flex: 1, alignItems: "center", paddingTop: 45}]}>
                <View style={[{flexDirection: "row", justifyContent: "center"}]}>
                  <Text style={[typography.costInput, {padding: 0, height: 40, color: colors.darkGrey}]}>
                    $
                  </Text>
                  <TextInput
                    style={[typography.costInput, {width: this.state.costInputWidth, textAlign: 'center', color: colors.darkGrey}]}
                    placeholder={"5.00"}
                    defaultValue={this.state.eachCost}
                    onChangeText={(num) => { this.setState({eachCost: num}); }}
                    keyboardType={"decimal-pad"}
                    autoFocus={true} />
                  <Text style={[typography.costInput, {padding: 0, height: 40, color: colors.darkGrey}]}>
                    per month
                  </Text>
                </View>
                <View style={[{flexDirection: "row", justifyContent: "center"}]}>
                  <Text style={[typography.costInput, {padding: 0, height: 40, color: colors.darkGrey}]}>
                    for
                  </Text>
                  <TextInput
                    style={[typography.costInput, {width: this.state.costInputWidth, textAlign: 'center', color: colors.darkGrey}]}
                    placeholder={"12"}
                    defaultValue={this.state.totalPayments}
                    onChangeText={(num) => { this.setState({totalPayments: num}); }}
                    keyboardType={"number-pad"} />
                  <Text style={[typography.costInput, {padding: 0, height: 40, color: colors.darkGrey}]}>
                    months.
                  </Text>
                </View>
              </View>

              { /* Filler */ }
              <View style={[{flex: 0.2}]} />
            </View>

            { /* Header */ }
            <Header dark callbackClose={() => {this.callbackClose()}} headerProps={this.state.headerProps} />

            { /* Arrow nav buttons */ }
            <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
              <ArrowNav
              dark
              arrowNavProps={this.state.arrowNavProps}
              callbackLeft={() => { this.setState({inputting: "name", arrowNavProps: {left: false, right: true} }); }}
              callbackRight={() => { this.setState({inputting: "memo", arrowNavProps: {left: true, right: false} }); }} />
            </Animated.View>
          </View>

        );
      break;

      // User is inputting payment's purpose
      case "memo":

        if (this.state.loading) {
          return(
            <Loading
              complete={this.state.doneLoading}
              msgSuccess={"You are now splitting " + this.state.memo + " with " + this.state.user.first_name + "."}
              msgLoading={"Asking our moms for permission"}
              destination={() => Actions.MainViewContainer()} />
          );
        } else {
          return(
            <View style={[containers.container, {backgroundColor: colors.white}]}>
              <View style={containers.padHeader}>

                { /* User preview for the user we are paying or requesting  */ }
                { this.getUserPreview(this.state.user) }
                <Text style={[typography.textInput, {fontSize: 16.5, textAlign: 'center', padding: 15, color: colors.darkGrey}]}>
                  ${this.state.eachCost} per month for the next {this.state.totalPayments} months.
                </Text>

                { /* Input */ }
                <View style={[{flex: 1, alignItems: "center", paddingTop: 0}]}>
                  <View style={[{flexDirection: "column", justifyContent: "center"}]}>
                    <Text style={[typography.costInput, typography.marginLeft, {fontSize: 20, padding: 15, color: colors.darkGrey}]}>
                      What for?
                    </Text>
                    <TextInput
                      style={[typography.textInput, typography.marginSides, {width: (dimensions.width * 0.9), backgroundColor: colors.white, color: colors.darkGrey, paddingLeft: 15}]}
                      placeholder={"Toilet paper"}
                      autoFocus={true}
                      defaultValue={this.state.memo}
                      onChangeText={(text) => { this.setState({memo: text}); }} />
                  </View>
                </View>

                { /* Filler */ }
                <View style={[{flex: 0.2}]} />
              </View>

              { /* Header */ }
              <Header dark callbackClose={() => {this.callbackClose()}} headerProps={this.state.headerProps} />

              { /* Arrow nav buttons */ }
              <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
                <PayRequestNav
                  payCallback={() => { this.createPayment('out'); }}
                  requestCallback={() => { this.createPayment('in'); }} />
              </Animated.View>
            </View>
          );
        }
      break;
    }
  }
}

export default CreatePaymentView;
