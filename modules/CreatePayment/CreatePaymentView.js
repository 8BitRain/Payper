import React from 'react';
import { View, Text, TextInput, Dimensions, DeviceEventEmitter, StatusBar, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';

// Helpers
import * as Headers from '../../helpers/Headers';

// Components
import ArrowNav from '../../components/Navigation/Arrows/ArrowDouble';
import PayRequestNav from '../../components/Navigation/PayRequest/PayRequest';
import Loading from '../../components/Loading/Loading';
import UserPreview from '../../components/Previews/User/User'

// Modules
import UserSearch from '../../modules/UserSearch/UserSearchViewContainer';
import Header from '../../components/Header/Header';

// Stylesheets
import typography from '../../styles/typography';
import colors from '../../styles/colors';

// Used to size user previews
var dimensions = Dimensions.get('window');

function genUserPreview(user, options) {
  user.name = user.first_name + " " + user.last_name;
  return(
    <UserPreview
      key={user.username}
      user={user}
      width={dimensions.width}
      touchable={options.touchable} />
  );
}

class Purpose extends React.Component {
  constructor(props) {
    super(props);
    this.kbOffset = new Animated.Value(0);
    this.state = {
      awaitingConfirmationOn: "",
    }
  }

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

  componentDidMount() {
    _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
  }

  componentWillUnmount() {
    _keyboardWillShowSubscription.remove();
    _keyboardWillHideSubscription.remove();
  }

  _getPayRequestNav() {
    if (this.state.awaitingConfirmationOn) {
      return(
        <PayRequestNav
          awaitingConfirmationOn={this.state.awaitingConfirmationOn}
          confirmCallback={() => {
            this.props.sendPayment(this.props.payment, (success) => {
              if (success) Actions.MainViewContainer();
              else alert("Payment failed");
            });
          }} />
      );
    } else {
      return(
        <PayRequestNav
          awaitingConfirmationOn={this.state.awaitingConfirmationOn}
          payCallback={() => {
            this.setState({ awaitingConfirmationOn: "pay" });
            this.props.setPaymentInfo({
              payment: {
                amount: this.props.amount,
                purpose: this.props.purpose,
                payments: this.props.payments,
              },
              currentUser: this.props.currentUser,
              otherUser: this.props.selectedContact,
              type: "pay"
            });
          }}
          requestCallback={() => {
            this.setState({ awaitingConfirmationOn: "request" });
            this.props.setPaymentInfo({
              payment: {
                amount: this.props.amount,
                purpose: this.props.purpose,
                payments: this.props.payments,
              },
              currentUser: this.props.currentUser,
              otherUser: this.props.selectedContact,
              type: "request"
            });
          }} />
      );
    }
  }

  _logTouchEvent(e, type) {
    // if (!this.logEvents) return;
    console.log("%cTouch event: " + type, "color:blue;font-weight:900;");
    console.log(e.nativeEvent);
    console.log("%c--------------------------------------------------", "color:blue;font-weight:900;")

    if (this.state.awaitingConfirmationOn.length > 0)
      this.setState({awaitingConfirmationOn: ""});
  }

  _handleStart(e) {
    this._logTouchEvent(e, "start");
  }

  render() {
    return(
      <View
        onStartShouldSetResponder={(e) => this._handleStart(e)}
        style={{flex: 1.0, backgroundColor: colors.white}}>
        { /* User preview for the user we are paying or requesting  */ }
        <View style={{flex: 0.2}}>
          { genUserPreview(this.props.selectedContact, {touchable: false}) }
          <Text style={[typography.textInput, {fontSize: 16.5, textAlign: 'center', padding: 15, color: colors.darkGrey}]}>
            ${this.props.amount} per month for the next {this.props.payments} months.
          </Text>
        </View>

        { /* Input */ }
        <View
          style={{flex: 0.8}}>
          <Text style={[typography.costInput, typography.marginLeft, {fontSize: 20, padding: 15, color: colors.darkGrey}]}>
            What for?
          </Text>
          <TextInput
            style={[typography.textInput, typography.marginSides, {width: (dimensions.width * 0.9), backgroundColor: colors.white, color: colors.darkGrey, paddingLeft: 15}]}
            placeholder={"Toilet paper"}
            autoFocus={true}
            defaultValue={this.props.purpose}
            onChangeText={(text) => this.props.setPurpose(text)} />
        </View>

        { /* Arrow nav buttons */ }
        <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
          { this._getPayRequestNav() }
        </Animated.View>
      </View>
    );
  }
}

class Amount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      costInputWidth: 100,
    }

    this.kbOffset = new Animated.Value(0);
  }

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

  componentDidMount() {
    _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
    _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
  }

  componentWillUnmount() {
    _keyboardWillShowSubscription.remove();
    _keyboardWillHideSubscription.remove();
  }

  render() {
    return(
      <View style={{flex: 1.0, backgroundColor: colors.white}}>
        { /* User preview for the user we are paying or requesting  */ }
        <View style={{flex: 0.2}}>
          { genUserPreview(this.props.selectedContact, {touchable: false}) }
        </View>

        { /* Input */ }
        <View style={{flex: 0.8}}>
          <View style={[{flexDirection: "row", justifyContent: "center"}]}>
            <Text style={[typography.costInput, {padding: 0, height: 40, color: colors.darkGrey}]}>
              $
            </Text>
            <TextInput
              style={[typography.costInput, {width: this.state.costInputWidth, textAlign: 'center', color: colors.darkGrey}]}
              placeholder={"5.00"}
              defaultValue={this.props.amount}
              onChangeText={(num) => this.props.setAmount(num)}
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
              defaultValue={this.props.payments}
              onChangeText={(num) => this.props.setPayments(num)}
              keyboardType={"number-pad"} />
            <Text style={[typography.costInput, {padding: 0, height: 40, color: colors.darkGrey}]}>
              months.
            </Text>
          </View>
        </View>

        { /* Arrow nav buttons */ }
        <Animated.View style={{position: 'absolute', bottom: this.kbOffset, left: 0, right: 0}}>
          <ArrowNav
            dark
            arrowNavProps={{left: true, right: true}}
            callbackLeft={() => this.props.setPageIndex(0)}
            callbackRight={() => this.props.setPageIndex(2)} />
        </Animated.View>
      </View>
    );
  }
}

class InnerContent extends React.Component {
  constructor(props) {
    super(props);
    console.log("+++ Selected contact in InnerContent.constructor()", this.props.selectedContact);
    console.log("+++ Payment info in InnerContent.constructor()", this.props.paymentInfo);
  }

  render() {
    switch (this.props.inputting) {
      case "user":
        return <UserSearch { ...this.props } />;
        break;
      case "amount":
        return <Amount { ...this.props } />
        break;
      case "purpose":
        return <Purpose { ...this.props } />
        break;
    }
  }
}


class CreatePaymentView extends React.Component {
  constructor(props) {
    super(props);

    this.pages = ["user", "amount", "purpose"];

    this.state = {
      inputting: "user",
      header: Headers.createPaymentHeader(),
    };
  }

  componentWillMount() {
    console.log("MOUNTING CREATEPAYMENTVIEW.JS");
    this.props.setToken(this.props.currentUser.token);
  }

  _setPageIndex(i) {
    if (i != this.state.header.index) {
      var h = this.state.header;
      h.index = i;
      this.setState({ header: h, inputting: this.pages[i] });
    }
  }

  render() {
    return (
      <View style={{flex: 1.0}}>
        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Header */ }
        <View style={{flex: 0.1}}>
          <Header
            callbackClose={ () => Actions.MainViewContainer() }
            numUnseenNotifications={ this.props.numUnseenNotifications }
            headerProps={ this.state.header } />
        </View>

        { /* Inner content */ }
        <View style={{flex: 0.9}}>
          <InnerContent
            { ...this.props }
            inputting={ this.state.inputting }
            setPageIndex={ (i) => this._setPageIndex(i) }
            />
        </View>
      </View>
    );
  }
}

export default CreatePaymentView;
