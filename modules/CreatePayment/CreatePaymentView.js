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
const dimensions = Dimensions.get('window');

class Purpose extends React.Component {
  constructor(props) {
    super(props);
    this.kbOffset = new Animated.Value(0);
    this.state = {
      awaitingConfirmationOn: "",
      loading: false,
      success: null,
    };
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
          loading={this.state.loading}
          confirmCallback={() => {
            this.setState({ loading: true });
            this.props.sendPayment(this.props.payment, (success) => {
              if (success) {

                // Set active filter tab in payment view
                if (this.props.payment.sender_id == this.props.currentUser.uid) this.props.setActiveFilter("outgoing");
                else this.props.setActiveFilter("incoming");

                // Reset the create payment state
                this.setState({ awaitingConfirmationOn: "", loading: false });
                this.props.reset();

                // Return to home page
                Actions.MainViewContainer();

              } else {
                this.setState({ awaitingConfirmationOn: "", loading: false });
                alert("Payment failed");
              }
            });
          }} />
      );
    } else {
      return(
        <PayRequestNav
          awaitingConfirmationOn={this.state.awaitingConfirmationOn}
          loading={this.state.loading}
          payCallback={() => {
            if (this.props.purpose) {
              this.setState({ awaitingConfirmationOn: "pay" });
              this.props.setPaymentInfo({
                payment: {
                  amount: this.props.amount,
                  purpose: this.props.purpose,
                  payments: this.props.payments,
                },
                currentUser: this.props.currentUser,
                otherUser: this.props.selectedContact,
                type: "payment"
              });
            } else {
              // Prompt the user to enter the purpose memo information
              alert("Please enter the purpose of the payment");
            }
          }}
          requestCallback={() => {
            if (this.props.purpose) {
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
            } else {
              // Prompt the user to enter the purpose memo information
              alert("Please enter the purpose of the payment");
            }
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
          <UserPreview
            key={this.props.selectedContact.username || this.props.selectedContact.phone}
            user={this.props.selectedContact}
            width={dimensions.width}
            touchable={false} />
          <Text style={[typography.textInput, {fontSize: 16.5, textAlign: 'center', padding: 15, color: colors.richBlack}]}>
            ${this.props.amount} per month for the next {this.props.payments} months.
          </Text>
        </View>

        { /* Input */ }
        <View
          style={{flex: 0.8}}>
          <Text style={[typography.costInput, typography.marginLeft, {fontSize: 20, padding: 15, color: colors.richBlack}]}>
            What for?
          </Text>
          <TextInput
            style={[typography.textInput, typography.marginSides, {width: (dimensions.width * 0.9), backgroundColor: colors.white, color: colors.richBlack, paddingLeft: 15}]}
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
        <View style={{flex: 0.15}}>
          <UserPreview
            key={this.props.selectedContact.username || this.props.selectedContact.phone}
            user={this.props.selectedContact}
            width={dimensions.width}
            touchable={false} />
        </View>

        { /* Input */ }
        <View style={{flex: 0.85}}>
          <View style={[{flexDirection: "row", justifyContent: "center"}]}>
            <Text style={[typography.costInput, {padding: 0, height: 40, color: colors.richBlack}]}>
              $
            </Text>
            <TextInput
              style={[typography.costInput, {width: this.state.costInputWidth, textAlign: 'center', color: colors.richBlack}]}
              placeholder={"5.00"}
              defaultValue={this.props.amount}
              onChangeText={(num) => this.props.setAmount(num)}
              keyboardType={"decimal-pad"}
              autoFocus={true} />
            <Text style={[typography.costInput, {padding: 0, height: 40, color: colors.richBlack}]}>
              per month
            </Text>
          </View>
          <View style={[{flexDirection: "row", justifyContent: "center"}]}>
            <Text style={[typography.costInput, {padding: 0, height: 40, color: colors.richBlack}]}>
              for
            </Text>
            <TextInput
              style={[typography.costInput, {width: this.state.costInputWidth, textAlign: 'center', color: colors.richBlack}]}
              placeholder={"12"}
              defaultValue={this.props.payments}
              onChangeText={(num) => this.props.setPayments(num)}
              keyboardType={"number-pad"} />
            <Text style={[typography.costInput, {padding: 0, height: 40, color: colors.richBlack}]}>
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
            callbackRight={() => {
              if (this.props.amount && this.props.payments) {
                this.props.setPageIndex(2);
              } else {
                // Prompt the user to enter the missing payment information
                if (!this.props.amount && !this.props.payments) alert("Please specify the the payment amount and the length of the payment series.");
                else if (!this.props.amount && this.props.payments) alert("Please specify the the payment amount.");
                else if (this.props.amount && !this.props.payments) alert("Please specify the length of the payment series.");
              }
            }} />
        </Animated.View>
      </View>
    );
  }
}

class InnerContent extends React.Component {
  constructor(props) {
    super(props);
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
    this.props.setToken(this.props.currentUser.token);
  }

  _setPageIndex(i) {
    if (i != this.state.header.index) {
      var h = this.state.header;
      if (i == 2) h = Headers.createPaymentPurposeHeader({ callbackBack: () => this._setPageIndex(1) });
      else h = Headers.createPaymentHeader();
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
        <View style={{ flex: (dimensions.height < 667) ? 0.12 : 0.1 }}>
          <Header
            callbackClose={ () => { this.props.reset(); Actions.MainViewContainer({direction: "vertical"}); }}
            callbackBack={ () => this._setPageIndex(1) }
            numUnseenNotifications={ this.props.numUnseenNotifications }
            headerProps={ this.state.header } />
        </View>

        { /* Inner content */ }
        <View style={{ flex: (dimensions.height < 667) ? 0.88 : 0.9 }}>
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
