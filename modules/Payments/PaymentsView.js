import React from 'react';
import { View, Text, TouchableHighlight, ListView, DataSource, RecyclerViewBackedScrollView, Dimensions, ActionSheetIOS, Modal, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';

// Helpers
import * as Alert from '../../helpers/Alert';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as Init from '../../_init';
import * as Lambda from '../../services/Lambda';

// Components
import Footer from '../../components/Footer/Footer';
import IAVWebView from '../../components/IAVWebView/IAVWebView';
import CreatePayment from '../../modules/CreatePayment/CreatePaymentView';
import BankOnboarding from '../../modules/BankOnboarding/BankOnboardingView';
import MicrodepositOnboarding from '../../components/MicrodepositOnboarding/MicrodepositOnboarding';
import NoticeBar from '../../components/NoticeBar/NoticeBar';

// Payment card components
import Active from '../../components/PaymentCards/Active';
import PendingConfirmation from '../../components/PaymentCards/PendingConfirmation';
import PendingFundingSource from '../../components/PaymentCards/PendingFundingSource';
import PendingInvite from '../../components/PaymentCards/PendingInvite';

// Stylesheets
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

class Payments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      modalVisible: false
    }
  }

  cancelPayment(payment) {
    // TODO: Optimistically delete payment card
    Lambda.cancelPayment({ token: this.props.currentUser.token, payment_id: payment.pid });
  }

  confirmPayment(payment) {
    // TODO: Optimistically mark payment card as confirmed
    Lambda.confirmPayment({ token: this.props.currentUser.token, payment_id: payment.pid });

  }

  rejectPayment(payment) {
    // TODO: Optimistically delete payment card
    Lambda.rejectPayment({ token: this.props.currentUser.token, payment_id: payment.pid });
  }

  _showMenu(payment) {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel Payment Series', 'Block User', 'Nevermind'],
      cancelButtonIndex: 2
    }, (buttonIndex) => {
      if (buttonIndex == 0) {
        // Define strings to be displayed in alert
        var firstName = (this.props.activeFilter == "outgoing") ? payment.recip_name.split(" ")[0] : payment.sender_name.split(" ")[0],
            purpose = StringMaster5000.formatPurpose(payment.purpose),
            message;

        // Concatenate strings depending on payment flow direction
        if (this.props.currentUser.uid == payment.sender_id) message = "You'll stop paying " + firstName + " " + purpose;
        else message = firstName + " will stop paying you " + purpose;

        // Request confirmation
        Alert.confirmation({
          title: "Are you sure you'd like to cancel this payment?",
          message: message,
          cancelMessage: "Nevermind",
          confirmMessage: "Yes, cancel the payment series.",
          cancel: () => console.log("Nevermind"),
          confirm: () => this.cancelPayment(payment)
        });
      } else if (buttonIndex == 1) {
        // Extend scope
        const _this = this;

        var title = "Are you sure you'd like to block " +
          ((this.props.activeFilter == "outgoing")
            ? payment.recip_name
            : payment.sender_name) + "?";

        // Request confirmation
        Alert.confirmation({
          title: title,
          message: "You can always unblock them in the 'My Profile' page.",
          cancelMessage: "Nevermind",
          confirmMessage: "Yes, block this user",
          cancel: () => console.log("Nevermind"),
          confirm: () => Lambda.blockUser({
            token: _this.props.currentUser.token,
            blocked_id: (_this.props.activeFilter == "outgoing") ? payment.recip_id : payment.sender_id,
          }),
        });
      }
    });
  }

  _confirmPayment(payment) {
    var title = "$" + payment.amount + " per month for " + payment.payments + " months - " + payment.purpose;
    Alert.confirmation({
      title: title,
      message: "Would you like to confirm this payment series?",
      cancelMessage: "Nevermind",
      confirmMessage: "Yes",
      cancel: () => console.log("Nevermind"),
      confirm: () => this.confirmPayment(payment)
    });
  }

  _rejectPayment(payment) {
    var title = "$" + payment.amount + " per month for " + payment.payments + " months - " + payment.purpose;
    Alert.confirmation({
      title: title,
      message: "Would you like to reject this payment series?",
      cancelMessage: "Nevermind",
      confirmMessage: "Yes",
      cancel: () => console.log("Nevermind"),
      confirm: () => this.rejectPayment(payment)
    });
  }

  _archiveCompletePayments(options) {

    console.log("_archiveCompletePayments was invoked...");
    console.log("this.props.current")

    let payments;

    // Determine which payment set to look through
    if (this.props.currentUser.paymentFlow)
      payments = (this.props.activeFilter === "outgoing") ? this.props.currentUser.paymentFlow.out : this.props.currentUser.paymentFlow.in;
    else
      payments = [];

    console.log("payments\n", payments);

    // If a payment is complete, animate it out, then archive it
    for (var p in payments) {
      const curr = payments[p];
      if (curr.paymentsMade === Number.parseInt(curr.payments)) {
        Lambda.archivePayment({ payment_id: curr.pid, token: this.props.currentUser.token });
      }
    }
  }

  _toggleModal(options) {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  _renderEmptyState() {
    return(
      <View style={{flex: 1.0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white}}>
        <Text style={{fontSize: 18, color: colors.richBlack}}>
          { "No active " + this.props.activeFilter + " payments." }
        </Text>
      </View>
    );
  }

  _renderPaymentList() {
    // Determine which data source to use for the payment list view
    var ds = (this.props.activeFilter == "incoming") ? this.props.incomingPayments : this.props.outgoingPayments;

    // If our data source is not null and has contents, use it to populate the payment list view
    if (ds && ds.getRowCount() > 0 && ds._cachedRowCount != 0) {
      return(
        <View style={{flex: 1.0}}>
          <ListView
            dataSource={ds}
            renderRow={this._renderRow.bind(this)}
            renderFooter={this._renderFooter.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            enableEmptySections />
        </View>
      );
    }
    // Otherwise, return an empty state
    else {
      return this._renderEmptyState();
    }
  }

  _renderFooter() {
    return(
      <View style={{ flex: 1.0, height: 130, backgroundColor: 'transparent' }} />
    );
  }

  _renderRow(payment) {
    var paymentInfo = {
      amount: payment.amount,
      purpose: payment.purpose,
      payments: payment.payments,
      paymentsMade: payment.paymentsMade,
      nextPayment: payment.nextPayment
    };

    var user = {
      name: (payment.flow == "incoming") ? payment.sender_name : payment.recip_name,
      pic: (payment.flow == "incoming") ? payment.sender_pic : payment.recip_pic
    };

    switch(payment.status) {
      case "active":
        return(
          <Active
            user={user}
            payment={paymentInfo}
            showMenu={() => this._showMenu(payment)} />
        );
      break;
      case "pendingInvite":
        return(
          <PendingInvite
            user={user}
            payment={paymentInfo}
            showMenu={() => this._showMenu(payment)} />
        );
      break;
      case "pendingConfirmation":
        return(
          <PendingConfirmation
            user={user}
            payment={paymentInfo}
            showButtons={payment.flow == "outgoing"}
            confirmPayment={() => this._confirmPayment(payment)}
            rejectPayment={() => this._rejectPayment(payment)}
            showMenu={() => this._showMenu(payment)} />
        );
      break;
      case "pendingSenderFundingSource":
        var message = (payment.sender_id == this.props.currentUser.uid)
          ? "It looks like you haven't linked a bank account to your Payper account. Payments will commence once you do so."
          : "It looks like " + payment.sender_name.split(" ")[0] + " hasn't linked a bank account to their Payper account. Payments will commence once they do so.";
        return(
          <PendingFundingSource
            user={user}
            payment={paymentInfo}
            message={message}
            showMenu={() => this._showMenu(payment)} />
        );
      break;
      case "pendingRecipFundingSource":
        var message = (payment.recip_id == this.props.currentUser.uid)
          ? "It looks like you haven't linked a bank account to your Payper account. Payments will commence once you do so."
          : "It looks like " + payment.recip_name.split(" ")[0] + " hasn't linked a bank account to their Payper account. Payments will commence once they do so.";
        return(
          <PendingFundingSource
            user={user}
            payment={paymentInfo}
            message={message}
            showMenu={() => this._showMenu(payment)} />
        );
      break;
      case "pendingBothFundingSources":
        var message = (payment.flow == "incoming")
          ? "Neither you nor " + payment.sender_name.split(" ")[0] + " have linked a bank account to your Payper account. This payment series will begin once you do so."
          : "Neither you nor " + payment.recip_name.split(" ")[0] + " have linked a bank account to your Payper account. This payment series will begin once you do so.";
        return(
          <PendingFundingSource
            user={user}
            payment={paymentInfo}
            message={message}
            showMenu={() => this._showMenu(payment)} />
        );
      break;
      default:
        return(
          <View style={{ justifyContent: 'center', alignItems: 'center', height: 70, backgroundColor: colors.alertRed }}>
            <Text style={{ fontSize: 16, fontFamily: 'Roboto', color: colors.white }}>
              Failed to render payment :(
            </Text>
          </View>
        );
    }
  }

  getModalInnerContent() {
    if (this.props.currentUser.appFlags.onboarding_state === "awaitingMicrodepositVerification") {
      return(
        <View style={{ flex: 1.0, marginTop: 20, backgroundColor: colors.richBlack }}>
          <MicrodepositOnboarding
            {...this.props}
            toggleModal={(options) => this._toggleModal(options)} />
        </View>
      );
    } else switch (this.props.currentUser.appFlags.onboarding_state) {
      case "complete":
        return(
          <CreatePayment
            {...this.props}
            toggleModal={(options) => this._toggleModal(options)} />
        );
      break;
      case "customer":
        return(
          <View style={{ flex: 1.0, marginTop: 20, backgroundColor: colors.richBlack }}>
            <BankOnboarding
              {...this.props}
              closeModal={() => this._toggleModal()}
              displayCloseButton={true} />
          </View>
        );
      break;
      case "bank":
        return(
          <IAVWebView refreshable
            IAVToken={this.props.currentUser.IAVToken}
            firebaseToken={this.props.currentUser.token}
            currentUser={this.props.currentUser}
            toggleModal={() => this._toggleModal()} />
        );
      break;
      default:
        return(
          <View style={{ flex: 1.0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
            <Text style={{ color: colors.white, fontSize: 16, textAlign: 'center', paddingTop: 50 }}>
              { "Something went wrong.\nPlease reload the app.\n(check getModalInnerContent() of PaymentsVew.js)" }
            </Text>
          </View>
        );
    }
  }


  render() {
    // TODO: Do this in componentDidMount() instead?
    this._archiveCompletePayments();

    return(
      <View style={{flex: 1.0, backgroundColor: colors.white}}>

        <View style={{flex: 1.0}}>
          { /* Bank account notice bar (if necessary) */
            (this.props.currentUser.appFlags.onboarding_state === "awaitingMicrodepositVerification" || this.props.currentUser.appFlags.onboarding_state === "bank")
            ? <NoticeBar onboardingState={this.props.currentUser.appFlags.onboarding_state} />
            : null }

          { /* Payment list (or empty state) */
            this._renderPaymentList() }
        </View>

        { /* Footer */ }
        <View
          pointerEvents="box-none"
          style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0, height: dimensions.height * 0.2}}>
          <Footer callbackPay={() => this._toggleModal()} />
        </View>

        { /* Modal containing create payment panel */ }
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={ () => alert("Closed modal") }>

          <StatusBar barStyle="light-content" />
          { this.getModalInnerContent() }

        </Modal>
      </View>
    );
  }
}

export default Payments;
