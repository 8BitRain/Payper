import React from 'react';
import { View, Text, TouchableHighlight, ListView, DataSource, RecyclerViewBackedScrollView, Dimensions, ActionSheetIOS, Modal, StatusBar, Image, Easing, Animated } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';
import * as Animatable from 'react-native-animatable';


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
import Carousel from 'react-native-carousel';

// Payment card components
import Active from '../../components/PaymentCards/Active';
import PendingConfirmation from '../../components/PaymentCards/PendingConfirmation';
import PendingFundingSource from '../../components/PaymentCards/PendingFundingSource';
import PendingInvite from '../../components/PaymentCards/PendingInvite';

//Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
// Stylesheets
import colors from '../../styles/colors';
import carousel from '../../styles/carousel';
const dimensions = Dimensions.get('window');


class Payments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      bankModalVisible: false
    }
     this.pulseValue_0 = new Animated.Value(1);
     this.pulseValue_1 = new Animated.Value(1);
     this.pulseValue_2 = new Animated.Value(1);


  }

  componentDidMount(){
    //this.refs.pulse.transitionTo({opacity: 0}, 9);
    console.log("Animating");
    this.pulse_0();
    this.pulse_1();
    this.pulse_2();
    //this.animatePulse();
  }

  pulse_0() {
  this.pulseValue_0.setValue(1);
  Animated.timing(
    this.pulseValue_0,
    {
      toValue: 0,
      duration: 1000,
      easing: Easing.ease
    }
  ).start(() => this.pulse_0())
  }

  pulse_1() {
  this.pulseValue_1.setValue(1);
  Animated.timing(
    this.pulseValue_1,
    {
      toValue: 0,
      duration: 1500,
      easing: Easing.ease,
      delay: 1000,
    }
  ).start(() => this.pulse_1())
  }

  pulse_2() {
  this.pulseValue_2.setValue(1);
  Animated.timing(
    this.pulseValue_2,
    {
      toValue: 0,
      duration: 2000,
      easing: Easing.ease,
      delay: 1500
    }
  ).start(() => this.pulse_2())
  }

  animatePulse() {
  this.pulseValue_0.setValue(1);
  this.pulseValue_1.setValue(1);
  this.pulseValue_2.setValue(1);
  const createAnimation = function (value, duration, easing, delay = 0) {
    return Animated.timing(
      value,
      {
        toValue: 0,
        duration,
        easing,
        delay
      }
    )
  }
  Animated.stagger([
    Animated.timing(
      this.pulseValue_0,
      {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        delay: 0
      }
    ),
    Animated.timing(
      this.pulseValue_1,
      {
        toValue: 0,
        duration: 1000,
        easing: Easing.ease,
        delay: 0
      }
    ),
    Animated.timing(
      this.pulseValue_2,
      {
        toValue: 0,
        duration: 1500,
        easing: Easing.ease,
        delay: 0
      }
    )
  ]).start()
}

  cancelPayment(payment) {
    let params = {
      token: this.props.currentUser.token,
      payment_id: payment.pid,
      type: payment.type,
      status: payment.status
    };

    console.log("Cancelling payment with params", params);

    // TODO: Optimistically delete payment card
    Lambda.cancelPayment(params);
  }

  confirmPayment(payment) {
    let params = {
      token: this.props.currentUser.token,
      payment_id: payment.pid,
      type: payment.type,
      status: payment.status
    };

    console.log("Confirming payment with params", params);

    // TODO: Optimistically mark payment card as confirmed
    Lambda.confirmPayment(params);

  }

  rejectPayment(payment) {
    let params = {
      token: this.props.currentUser.token,
      payment_id: payment.pid,
      type: payment.type,
      status: payment.status
    };

    console.log("Rejecting payment with params", params);

    // TODO: Optimistically delete payment card
    Lambda.rejectPayment(params);
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
    let payments;

    // Determine which payment set to look through
    if (this.props.currentUser.paymentFlow)
      payments = (this.props.activeFilter === "outgoing") ? this.props.currentUser.paymentFlow.out : this.props.currentUser.paymentFlow.in;
    else
      payments = [];

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

  toggleBankModal() {
    this.setState({ bankModalVisible: !this.state.bankModalVisible });
  }

  _renderEmptyState() {
    const pulse_0 = this.pulseValue_0.interpolate({
     inputRange: [0, 1],
     outputRange: [1.25, 1]
    })
    const pulse_1 = this.pulseValue_1.interpolate({
     inputRange: [0, 1],
     outputRange: [2.03, 1]
    })
    const pulse_2 = this.pulseValue_2.interpolate({
     inputRange: [0, 1],
     outputRange: [2.8, 1]
    })
    return(
      <View style={{flex: 1, flexDirection: 'column', backgroundColor: colors.white}}>
          {/*Note the static value 165 needs to account for the position that the footer is away from the bottom of the screen*/}
          <View style={{position: "absolute", height: dimensions.height * .16, bottom: 0, left: 0, right: 0,  justifyContent: 'center', alignItems: 'center', borderColor: "black", borderWidth: 0}}>
          {/*<Animated.Image source={require('../../assets/images/Oval.png')} style={{ alignItems: "center", position: "absolute", top: -((80-64)/2), left: dimensions.width/2 - (80/2), height: pulse_0, width: pulse_0, opacity: this.pulseValue_0}}/>*/}
          <Animated.Image source={require('../../assets/images/Oval.png')} style={{ alignItems: "center", position: "absolute", top: 0, left: dimensions.width/2 - (64/2), width: 64, height: 64, transform: [{scaleX: pulse_0}, {scaleY: pulse_0}], opacity: this.pulseValue_0}}/>
          <Animated.Image source={require('../../assets/images/Oval.png')} style={{ alignItems: "center", position: "absolute", top: 0, left: dimensions.width/2 - (64/2), width: 64, height: 64, transform: [{scaleX: pulse_1}, {scaleY: pulse_1}], opacity: this.pulseValue_1}}/>
          <Animated.Image source={require('../../assets/images/Oval.png')} style={{ alignItems: "center", position: "absolute", top: 0, left: dimensions.width/2 - (64/2), width: 64, height: 64, transform: [{scaleX: pulse_2}, {scaleY: pulse_2}], opacity: this.pulseValue_2}}/>
          {/*<Animated.Image  source={require('../../assets/images/Oval.png')} style={{ position: "absolute", top: -((130-64)/2), left: dimensions.width/2 - (130/2), height: 130, width: 130, opacity: this.pulseValue_1}}/>
          <Animated.Image  source={require('../../assets/images/Oval.png')} style={{ position: "absolute", top: -((180-64)/2), left: dimensions.width/2 - (180/2), height: 180, width: 180, opacity: this.pulseValue_2}}/>*/}
          </View>
          <Carousel hideIndicators={true} animate={true} delay={5000}>
            <View style={{ alignItems: 'center', justifyContent: 'center', margin: 10, marginBottom: 100, width: dimensions.width - 20}}>
              <Ionicons style={{ paddingTop: 1, paddingBottom: 1, paddingLeft: 4, paddingRight: 4, borderRadius: 3}} size={128} name="ios-thunderstorm-outline" color={'rgba(0, 0, 0, 0.15)'} />
              <Text style={{ backgroundColor: 'transparent', textAlign: 'center', fontSize: 20, fontWeight: '200', paddingLeft: 35, paddingRight: 35, color: colors.richBlack, width: dimensions.width - 20, padding: 0}}>{ "There’s a storm brewing. A savings storm." }</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', margin: 10, marginBottom: 100, width: dimensions.width - 20}}>
              <Ionicons style={{ paddingTop: 1, paddingBottom: 1, paddingLeft: 4, paddingRight: 4, borderRadius: 3}} size={128} name="ios-heart-outline" color={'rgba(0, 0, 0, 0.15)'} />
              <Text style={{ backgroundColor: 'transparent', textAlign: 'center', fontSize: 20, fontWeight: '200', paddingLeft: 35, paddingRight: 35, color: colors.richBlack, width: dimensions.width - 20, padding: 0}}>{ "Split a Spotify family plan and listen for just $3 a month!" }</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', margin: 10, marginBottom: 100, width: dimensions.width - 20}}>
              <Ionicons style={{ paddingTop: 1, paddingBottom: 1, paddingLeft: 4, paddingRight: 4, borderRadius: 3}} size={128} name="ios-beer" color={'rgba(0, 0, 0, 0.15)'} />
              <Text style={{ backgroundColor: 'transparent', textAlign: 'center', fontSize: 20, fontWeight: '200', paddingLeft: 35, paddingRight: 35, color: colors.richBlack, width: dimensions.width - 20, padding: 0}}>{ "More savings, more beer money!" }</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', margin: 10, marginBottom: 100, width: dimensions.width - 20}}>
              <Ionicons style={{ paddingTop: 1, paddingBottom: 1, paddingLeft: 4, paddingRight: 4, borderRadius: 3}} size={128} name="ios-stopwatch-outline" color={'rgba(0, 0, 0, 0.15)'} />
              <Text style={{ backgroundColor: 'transparent', textAlign: 'center', fontSize: 20, fontWeight: '200', paddingLeft: 35, paddingRight: 35, color: colors.richBlack, width: dimensions.width - 20, padding: 0}}>{ "The longer you wait, the less you save. Start splitting now!" }</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', margin: 10, marginBottom: 100, width: dimensions.width - 20}}>
              <Ionicons style={{ paddingTop: 1, paddingBottom: 1, paddingLeft: 4, paddingRight: 4, borderRadius: 3}} size={128} name="ios-flame-outline" color={'rgba(0, 0, 0, 0.15)'} />
              <Text style={{ backgroundColor: 'transparent', textAlign: 'center', fontSize: 20, fontWeight: '200', paddingLeft: 35, paddingRight: 35, color: colors.richBlack, width: dimensions.width - 20, padding: 0}}>{ "\"It’s getting hot in here, so cut down on all your expenses\"" }</Text>
            </View>
          </Carousel>
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

  render() {
    // TODO: Do this in componentDidMount() instead?
    this._archiveCompletePayments();

    return(
      <View style={{flex: 1.0, backgroundColor: colors.white}}>

        <View style={{flex: 1.0}}>
          { /* Bank account notice bar (if necessary) */
            (this.props.currentUser.appFlags.onboarding_state === "awaitingMicrodepositVerification" || this.props.currentUser.appFlags.onboarding_state === "bank")
            ? <NoticeBar
                onboardingState={this.props.currentUser.appFlags.onboarding_state}
                onPress={() => this.toggleBankModal()} />
            : null }

          { /* Payment list (or empty state) */
            this._renderPaymentList() }
        </View>

        { /* Footer */ }
        <View
          pointerEvents="box-none"
          style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', position: 'absolute', bottom: 0, left: 0, right: 0, height: dimensions.height * 0.16}}>
          <Footer callbackPay={() => this._toggleModal()} />
        </View>

        { /* Create payment modal */ }
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={ () => alert("Closed modal") }>

          <StatusBar barStyle="light-content" />

          <CreatePayment
            {...this.props}
            toggleModal={(options) => this._toggleModal(options)} />

        </Modal>

        { /* Bank onboarding modal (if necessary) */
          (this.props.currentUser.appFlags.onboarding_state === "awaitingMicrodepositVerification" || this.props.currentUser.appFlags.onboarding_state === "bank")
          ? <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.bankModalVisible}
              onRequestClose={() => alert("Closed modal")}>

              <StatusBar barStyle="light-content" />

              {(this.props.currentUser.appFlags.onboarding_state === "awaitingMicrodepositVerification")
              ? <MicrodepositOnboarding currentUser={this.props.currentUser} toggleModal={() => this.toggleBankModal()} />
              : (this.props.currentUser.appFlags.onboarding_state === "bank")
                ? <IAVWebView refreshable
                    currentUser={this.props.currentUser}
                    firebaseToken={this.props.currentUser.token}
                    IAVToken={this.props.currentUser.IAVToken}
                    toggleModal={() => this.toggleBankModal()} />
                : null }

            </Modal>
          : null }

      </View>
    );
  }
}

export default Payments;
