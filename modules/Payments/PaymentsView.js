import React from 'react';
import { View, Text, TouchableHighlight, ListView, DataSource, RecyclerViewBackedScrollView, Dimensions, ActionSheetIOS, Modal, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';

// Helpers
import * as Alert from '../../helpers/Alert';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as Init from '../../_init';
import * as Lambda from '../../services/Lambda';

// Components
import Footer from '../../components/Footer/Footer';
import CreatePayment from '../../modules/CreatePayment/CreatePaymentViewContainer';
import BankOnboarding from '../../modules/BankOnboarding/BankOnboardingContainer';
import VerifyMicrodeposit from '../../modules/BankOnboarding/Pages/VerifyMicrodeposit';

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
      modalVisible: false,
    }
  }

  componentDidMount() {
    // Initialize header
    this.props.setActiveTab(this.props.activeTab);
  }

  componentWillUnmount() {
    // Disable listeners
    this.props.stopListening();
  }

  componentWillReceiveProps(newProps) {
    // If UID has changed, start listening to the user's payment flow
    if (newProps.currentUser.uid && newProps.currentUser.uid != this.state.uid) {
      this.setState({ uid: newProps.currentUser.uid }, () => {
        this.props.listen({ uid: this.state.uid });
      });
    }
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
          confirm: () => this.props.cancelPayment({
            pid: payment.pid,
            token: this.props.currentUser.token,
            ds: (this.props.activeFilter == "outgoing") ? this.props.outgoingPayments : this.props.incomingPayments,
            type: payment.type,
            flow: (this.props.activeFilter == "outgoing") ? "out" : "in",
            invite: payment.invite,
            confirmed: payment.confirmed,
          }),
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
      confirm: () => this.props.confirmPayment({
        pid: payment.pid,
        token: this.props.currentUser.token,
        ds: (payment.flow == "outgoing") ? this.props.outgoingPayments : this.props.incomingPayments,
      }),
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
      confirm: () => this.props.rejectPayment({
        pid: payment.pid,
        token: this.props.currentUser.token,
        ds: (payment.flow == "outgoing") ? this.props.outgoingPayments : this.props.incomingPayments,
      }),
    });
  }

  _archiveCompletePayments(options) {
    // Determine which payment set to look through
    var payments = (this.props.activeFilter === "outgoing") ? this.props.outgoingPayments._dataBlob.s1 : this.props.incomingPayments._dataBlob.s1;

    // If a payment is complete, animate it out, then archive it
    for (var p in payments) {
      const curr = payments[p];
      if (curr.paymentsMade === curr.payments) {
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
          No active{ (this.props.activeTab == "tracking") ? " " + this.props.activeFilter + " " : " " }payments.
        </Text>
      </View>
    );
  }

  _renderPaymentList() {
    // Determine which data source to use for the payment list view
    var ds;
    if (this.props.activeTab == "tracking") {
      ds = (this.props.activeFilter == "incoming") ? this.props.incomingPayments : this.props.outgoingPayments;
    } else if (this.props.tab == "global") {
      ds = this.props.globalPayments;
    }

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
    console.log("%cRendering payment:", "color:green;font-weight:900;");
    console.log(payment);

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

  _verifyOnboardingStatus() {
    if(this.props.currentUser.appFlags.onboarding_state == 'customer'){
      // Actions.BankOnboardingContainer();
      console.log(this.props.currentUser.token);
      this.props.setNewUserToken(this.props.currentUser.token);
    }
    //The user has completed customer creation and now has to go through dwolla IAV
    if(this.props.currentUser.appFlags.onboarding_state == 'bank') {
      if(this.props.currentUser.appFlags.customer_status == 'verified') {
        //Initiate IAV
        this.props.setNewUserToken(this.props.currentUser.token);

        var data = {
          token: this.props.currentUser.token
        };
        this.props.setLoading(true);
        const _this = this;
        //Initiate IAV
        Init.getIavToken(data, function(iavTokenRecieved, iavToken){
          if(iavTokenRecieved){
            _this.props.setIav(iavToken.token);
            //  Actions.BankOnboardingContainer();
          }
        });
        //The user needs to redo the customer creation process.
      } else if(this.props.currentUser.appFlags.customer_status == 'retry') {
          this.props.setRetry(true);
          this.props.setLoading(true);
          Actions.BankOnboardingContainer();
        //The user needs to provide additonal documents.
      } else if (this.props.currentUser.appFlags.customer_status == 'document') {
          this.props.setDocument(true);
          this.props.setLoading(true);
          Actions.BankOnboardingContainer();
      }
    }
    //The user has completed onboarding and can make payments.
    if(this.props.currentUser.appFlags.onboarding_state == 'complete'){
      Actions.CreatePaymentViewContainer();
    }
  }


  render() {

    this._archiveCompletePayments();

    return(
      <View style={{flex: 1.0, backgroundColor: colors.white}}>

        { /* List of payments or empty state */ }
        <View style={{flex: 1.0}}>
          { this._renderPaymentList() }
        </View>

        { /* Footer */ }
        <View
          pointerEvents="box-none"
          style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0, height: dimensions.height * 0.2}}>
          <Footer
            callbackFeed={() => this.props.setActiveTab('global')}
            callbackTracking={() => this.props.setActiveTab('tracking')}
            callbackPay={() => {
              if (this.props.currentUser.appFlags.onboarding_state != "complete") {
                Alert.message({
                  title: "Hey!",
                  message: "You must add a bank account before you can make a payment."
                });
                this._verifyOnboardingStatus();
              }

              this._toggleModal();
            }} />
        </View>

        { /* Modal containing create payment panel */ }
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={ () => alert("Closed modal") }>

          { /* Lighten status bar text */ }
          <StatusBar barStyle="light-content" />

          <View style={{flex: 1.0}}>

            { /* If user has a verified funding source, display create payment
                 flow. Otherwise, display bank account onboarding flow */
              (this.props.currentUser.appFlags.onboarding_state == "complete")
                ? <CreatePayment
                    {...this.props}
                    toggleModal={(options) => this._toggleModal(options)} />
                : (this.props.currentUser.appFlags.micro_deposit_flow)
                    ? <VerifyMicrodeposit
                        {...this.props}
                        toggleModal={(options) => this._toggleModal(options)} />
                    : <BankOnboarding
                        {...this.props}
                        toggleModal={(options) => this._toggleModal(options)} /> }

          </View>
        </Modal>
      </View>
    );
  }
}

export default Payments;
