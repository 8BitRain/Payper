// Dependencies
import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, StatusBar, Animated, Easing } from 'react-native';
import { Actions } from 'react-native-router-flux';
const { State: TextInputState } = TextInput;

// Helpers
import * as Lambda from '../../services/Lambda';
import * as Headers from '../../helpers/Headers';

// Components
import Header from '../../components/Header/Header';
import UserSelection from './pages/UserSelection';
import AmountAndDuration from './pages/AmountAndDuration';
import Purpose from './pages/Purpose';

// Stylesheets
import colors from '../../styles/colors';

// Used to size user previews
const dimensions = Dimensions.get('window');

class CreatePaymentView extends React.Component {
  constructor(props) {
    super(props);

    this.pages = ["user", "amount", "purpose"];

    this.state = {
      pageIndex: 0,
      offsetX: new Animated.Value(0),
      selectedContacts: {},
      amount: "",
      duration: "",
    };
  }

  _induceState(options) {
    if (options.selectedContacts) this.setState({ selectedContacts: options.selectedContacts });
    if (options.amount && options.duration) this.setState({ amount: options.amount, duration: options.duration });
  }

  _nextPage() {
    this.setState({ pageIndex: this.state.pageIndex + 1 });
    this._dismissKeyboard();
    Animated.timing(this.state.offsetX, {
      toValue: this.state.offsetX._value - dimensions.width,
      duration: 200,
      easing: Easing.elastic(0),
    }).start();
  }

  _prevPage() {
    this.setState({ pageIndex: this.state.pageIndex - 1 });
    this._dismissKeyboard();
    Animated.timing(this.state.offsetX, {
      toValue: this.state.offsetX._value + dimensions.width,
      duration: 200,
      easing: Easing.elastic(0),
    }).start();
  }

  _dismissKeyboard() {
    TextInputState.blurTextInput(TextInputState.currentlyFocusedField());
  }

  _sendPayment(options) {
    options.paymentInfo.sender = (options.paymentInfo.type == "request") ? options.user : this.props.currentUser;
    options.paymentInfo.recip = (options.paymentInfo.type == "request") ? this.props.currentUser : options.user;

    this.props.setActiveFilter((options.paymentInfo.type == "request") ? "incoming" : "outgoing");

    if (options.user.uid) {
      options.paymentInfo.invite = false;
      Lambda.createPayment(options.paymentInfo);
    } else {
      options.paymentInfo.invite = true;
      if (!options.paymentInfo.sender.uid) {
        options.paymentInfo.invitee = "sender";
        options.paymentInfo.phoneNumber = options.paymentInfo.sender.phone;
      } else {
        options.paymentInfo.invitee = "recip";
        options.paymentInfo.phoneNumber = options.paymentInfo.recip.phone;
      }
      Lambda.inviteViaPayment(options.paymentInfo);
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
            callbackClose={() => this.props.toggleModal()}
            callbackBack={() => this._prevPage()}
            numUnseenNotifications={this.props.numUnseenNotifications}
            headerProps={Headers.get({ header: "createPayment", index: this.state.pageIndex })} />
        </View>

        { /* Inner content */ }
        <View style={{ flex: (dimensions.height < 667) ? 0.88 : 0.9 }}>
          <Animated.View style={[styles.allPanelsWrap, { marginLeft: this.state.offsetX }]}>
            { /* User selection */ }
            <View>
              <UserSelection
                {...this.props}
                dismissKeyboard={() => this._dismissKeyboard()}
                induceState={(options) => this._induceState(options)}
                nextPage={() => this._nextPage()} />
            </View>

            { /* Amount and duration */ }
            <View>
              <AmountAndDuration
                {...this.props}
                dismissKeyboard={() => this._dismissKeyboard()}
                induceState={(options) => this._induceState(options)}
                selectedContacts={this.state.selectedContacts}
                nextPage={() => this._nextPage()}
                prevPage={() => this._prevPage()} />
            </View>

            { /* Purpose */ }
            <View>
              <Purpose
                {...this.props}
                dismissKeyboard={() => this._dismissKeyboard()}
                selectedContacts={this.state.selectedContacts}
                prevPage={() => this._prevPage()}
                sendPayment={(options) => this._sendPayment(options)}
                activeFundingSource={this.props.activeFundingSource}
                payment={{
                  amount: this.state.amount,
                  duration: this.state.duration,
                  users: this.state.selectedContacts,
                }} />
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  allPanelsWrap: {
    flexDirection: 'row',
    flex: 1.0,
    width: dimensions.width * 3.0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  }
});

export default CreatePaymentView;
