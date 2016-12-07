// Dependencies
import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, StatusBar, Animated, Easing } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Timer } from '../../classes/Metrics'
const { State: TextInputState } = TextInput;

// Helpers
import * as Lambda from '../../services/Lambda';
import * as Headers from '../../helpers/Headers';
import { colors } from '../../globalStyles'

// Components
import Header from '../../components/Header/Header';
import UserSelection from './pages/UserSelection';
import AmountFrequencyDuration from './pages/AmountFrequencyDuration';
import Purpose from './pages/Purpose';

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
      frequency: "",
      duration: ""
    };
  }

  componentWillMount() {
    this.timer = new Timer()
    this.timer.start()
  }

  induceState(newState) {
    this.setState(newState);
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
    // Strip user objects of unnecessary attributes
    let thisUser = this.props.currentUser.getPaymentAttributes(),
        otherUser = {
          first_name: options.user.first_name,
          last_name: options.user.last_name,
          profile_pic: options.user.profile_pic,
          username: options.user.username,
          uid: options.user.uid
        };

    // Determine sender and recip
    options.paymentInfo.sender = (options.paymentInfo.type == "request") ? otherUser : thisUser;
    options.paymentInfo.recip = (options.paymentInfo.type == "request") ? thisUser : otherUser;

    if (options.user.uid) {
      options.paymentInfo.invite = false;
      Lambda.createPayment(options.paymentInfo);
    } else {
      options.paymentInfo.invite = true;
      if (!options.paymentInfo.sender.uid) {
        options.paymentInfo.invitee = "sender";
        options.paymentInfo.phoneNumber = options.user.phone;
      } else {
        options.paymentInfo.invitee = "recip";
        options.paymentInfo.phoneNumber = options.user.phone;
      }

      Lambda.inviteViaPayment(options.paymentInfo);
    }

    this.timer.report("paymentOnboarding", this.props.currentUser.uid, {
      cancelled: false
    })
  }

  handleCancel() {
    this.timer.report("paymentOnboarding", this.props.currentUser.uid, {
      cancelled: true,
      cancelledOnPage: this.pages[this.state.pageIndex]
    })
    this.props.toggleModal();
  }

  render() {
    return (
      <View style={{flex: 1.0}}>
        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Header */ }
        <View style={{ flex: (dimensions.height < 667) ? 0.12 : 0.1 }}>
          <Header
            backgroundColor={colors.accent}
            callbackClose={() => this.handleCancel()}
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
                induceState={(options) => this.induceState(options)}
                nextPage={() => this._nextPage()} />
            </View>

            { /* Amount and duration */ }
            <View>
              <AmountFrequencyDuration
                {...this.props}
                dismissKeyboard={() => this._dismissKeyboard()}
                induceState={(options) => this.induceState(options)}
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
                activeFundingSource={this.props.currentUser.bankAccount}
                payment={{
                  amount: this.state.amount,
                  duration: this.state.duration,
                  frequency: this.state.frequency,
                  users: this.state.selectedContacts
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

module.exports = CreatePaymentView;
