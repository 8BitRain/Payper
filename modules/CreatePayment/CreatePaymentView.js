import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, Picker, AsyncStorage, Dimensions, DeviceEventEmitter, TouchableHighlight, TouchableOpacity} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import Autocomplete from 'react-native-autocomplete-input';

// Custom helper functions
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Async from "../../helpers/Async";
import * as Init from '../../_init';

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
      index: 0,

      // For user filtering
      users: [],
      query: "",

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
   }


   callbackClose() {
     Actions.MainViewContainer();
   }


   /**
     *   Ensure that state props change
   **/
   componentWillReceiveProps(nextProps) {
     this.setState({
       inputting: nextProps.inputting,
       index: nextProps.index,
       users: nextProps.users,
       query: nextProps.query,
       to: nextProps.to,
       currentUser: nextProps.currentUser,
       user: nextProps.user,
       memo: nextProps.memo,
       frequency: nextProps.frequency,
       totalCost: nextProps.totalCost,
       eachCost: nextProps.eachCost,
       totalPayments: nextProps.totalPayments,
       completedPayments: nextProps.completedPayments,
       cashFlow: nextProps.cashFlow,
       costInputWidth: nextProps.costInputWidth,
       arrowNavProps: nextProps.headerProps,
       headerProps: nextProps.headerProps,
       sessionToken: nextProps.sessionToken,
     });
   }


  /**
    *   Initializes payment creation process
  **/
  createPayment(flow) {
    const _this = this;
    this.setState({loading: true});
    console.log("CURR USER:", this.state.currentUser);
    console.log("OTHER USER:", this.state.user);
    var currUser = this.state.currentUser;
    // console.log("current user", currUser);
    // console.log("other user", this.state.user);

    if (flow == 'in') {
      console.log("TOKEN:", this.state.sessionToken);
      Init.createPayment({
        amount: this.state.eachCost,
        purpose: this.state.memo,
        payments: this.state.totalPayments,
        recip_id: currUser.uid,
        recip_name: currUser.first_name + " " + currUser.last_name,
        sender_name: currUser.first_name + " " + currUser.last_name,
        recip_pic: currUser.profile_pic,
        sender_id: this.state.user.uid,
        sender_name: this.state.user.first_name + " " + this.state.user.last_name,
        sender_pic: this.state.user.profile_pic,
        confirmed: false,
        type: "request",
        token: this.state.sessionToken,
      }, function() {
        _this.setState({doneLoading: true});
      });
    } else if (flow == 'out') {
      console.log(JSON.stringify(currUser));
      Init.createPayment({
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

  /**
    *   Sticky chevron
  **/
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
    *   1) Add keyboard measuring event listeners
    *   2) Initialize state
  **/
  componentDidMount() {
    const _this = this;

    _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));

    Async.get('user', (user) => {
      _this.setState({currentUser: JSON.parse(user)});
    });

    Async.get('session_token', (token) => {
      _this.setState({sessionToken: token});
    });

    Async.get('users', (users) => {
      users = JSON.parse(users);
      console.log("USERS AFTER GETTING THEM FROM ASYNC STORAGE\n", users);
      var arr = [];
      var user = {};
      for (var i in users) {
        user = users[i];
        user.username = i;
        user.name = user.first_name + " " + user.last_name;
        arr.push(users[i]);
      }
      console.log("USERS ARRAY:", arr);
      this.setState({users: arr});
    });
  }


  /**
    *   Remove listeners on dismount
  **/
  componentWillUnmount() {
    _keyboardWillShowSubscription.remove();
    _keyboardWillHideSubscription.remove();
  }


  /**
    *   Return filtered user array
  **/
  _findUser(query) {
    if (query === '') return [];
    const users = this.state.users;
    const regex = new RegExp(query + '.+$', 'i');
    var u = users.filter(user => user.name.search(regex) >= 0 && user.username != this.state.currentUser.username);
    return u;
  }


  /**
    *   Return a ready-to-render user preview
  **/
  _genUserPreview(user, options) {
    console.log(JSON.stringify(user));
    return(
      <UserPreview
        key={user.username}
        user={user}
        width={dimensions.width}
        callback={() => { this.setState({query: user.username, user: user}); }}
        touchable={options.touchable} />
    );
  }


  render() {

    switch (this.state.inputting) {

      // User is inputting name of other party
      case "name":

        const { query } = this.state;
        const user = this._findUser(query);

        return(

          <View style={[containers.container, {backgroundColor: colors.darkGrey}]}>
            <View style={containers.padHeader}>
              { /* Input */ }
              <View>
                <Autocomplete
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                  containerStyle={styles.autocompleteContainer}
                  inputContainerStyle={styles.inputContainer}
                  style={styles.input}
                  data={user}
                  defaultValue={query}
                  onChangeText={text => this.setState({query: text})}
                  renderItem={data => this._genUserPreview(data, {touchable: true}) } />
              </View>
            </View>

            { /* Header */ }
            <Header callbackClose={() => {this.callbackClose()}} index={this.state.index} headerProps={this.state.headerProps} />

            { /* Arrow nav buttons */ }
            <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
              <ArrowNav
              arrowNavProps={this.state.arrowNavProps}
              callbackRight={() => { this.setState({inputting: "frequency", arrowNavProps: {left: true, right: true}, index: 1}); }} />
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
              { this._genUserPreview(this.state.user, {touchable: false}) }

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
            <Header callbackClose={() => {this.callbackClose()}} index={this.state.index} headerProps={this.state.headerProps} />

            { /* Arrow nav buttons */ }
            <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
              <ArrowNav
              dark
              arrowNavProps={this.state.arrowNavProps}
              callbackLeft={() => { this.setState({inputting: "name", arrowNavProps: {left: false, right: true}, index: 0}); }}
              callbackRight={() => { this.setState({inputting: "memo", arrowNavProps: {left: true, right: false}, index: 2}); }} />
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
                { this._genUserPreview(this.state.user, {touchable: false}) }
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
              <Header callbackClose={() => {this.callbackClose()}} index={this.state.index} headerProps={this.state.headerProps} />

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


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingTop: 20,
  },
  autocompleteContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 4,
  },
  input: {
    backgroundColor: 'transparent',
    paddingLeft: 12.5,
    color: colors.white,
  }
});

export default CreatePaymentView;
