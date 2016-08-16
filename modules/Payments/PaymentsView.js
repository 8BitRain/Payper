import React from 'react';
import { View, Text, TouchableHighlight, ListView, DataSource, RecyclerViewBackedScrollView, Dimensions, ActionSheetIOS } from 'react-native';
import { Actions } from 'react-native-router-flux';

// Helpers
import * as Alert from '../../helpers/Alert';
import * as StringMaster5000 from '../../helpers/StringMaster5000';

// Partial components
import Footer from '../../components/Footer/Footer';
import Transaction from '../../components/Previews/Transaction/Transaction';

// Stylesheets
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');

class Payments extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Enable listeners
    var incomingPayments = "paymentFlow/" + this.props.currentUser.uid + "/in/",
        outgoingPayments = "paymentFlow/" + this.props.currentUser.uid + "/out/";
    this.props.listen([incomingPayments, outgoingPayments]);

    // Initialize header
    this.props.setActiveTab(this.props.activeTab);
  }

  componentWillUnmount() {
    // Disable listeners
    this.props.stopListening(this.props.activeFirebaseListeners);
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
    if (ds && ds.getRowCount() > 0) {
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
    return(
      <Transaction
        payment={payment}
        out={this.props.activeFilter == "outgoing"}
        callbackCancel={() => {
          // Define strings to be displayed in alert
          var firstName = (this.props.activeFilter == "outgoing") ? payment.recip_name.split(" ")[0] : payment.sender_name.split(" ")[0],
              purpose = StringMaster5000.formatPurpose(payment.purpose),
              message;

          // Concatenate strings depending on payment flow direction
          if (this.props.currentUser.uid == payment.sender_id) message = "You'll stop paying " + firstName + " " + purpose;
          else message = firstName + " will stop paying you " + purpose;

          // Alert the user
          Alert.confirmation({
            title: "Are you sure you'd like to cancel this payment?",
            message: message,
            cancelMessage: "Nevermind",
            confirmMessage: "Yes please",
            cancel: () => console.log("Nevermind"),
            confirm: () => this.props.cancelPayment({
              pid: payment.pid,
              token: this.props.currentUser.token,
              ds: (this.props.activeFilter == "outgoing") ? this.props.outgoingPayments : this.props.incomingPayments,
            })
          });
        }}
        callbackConfirm={() => {
          console.log("Confirming payment");

          var firstName = payment.recip_name.split(" ")[0],
              purpose = StringMaster5000.formatPurpose(payment.purpose);

          // Alert the user
          Alert.confirmation({
            title: "Would you like pay " + firstName + "?",
            message: "You can cancel the payments at any time.",
            cancelMessage: "Nevermind",
            confirmMessage: "Yes",
            cancel: () => console.log("Nevermind"),
            confirm: () => this.props.confirmPayment({
              pid: payment.pid,
              token: this.props.currentUser.token,
              ds: (this.props.activeFilter == "outgoing") ? this.props.outgoingPayments : this.props.incomingPayments,
            }),
          });
        }}
        callbackReject={() => {
          console.log("Rejecting payment");

          var firstName = payment.recip_name.split(" ")[0],
              purpose = StringMaster5000.formatPurpose(payment.purpose);

          // Alert the user
          Alert.confirmation({
            title: "Would you like reject the request from " + firstName + "?",
            message: "You can cancel the payments at any time.",
            cancelMessage: "Nevermind",
            confirmMessage: "Yes",
            cancel: () => console.log("Nevermind"),
            confirm: () => this.props.rejectPayment({
              pid: payment.pid,
              token: this.props.currentUser.token,
              ds: (this.props.activeFilter == "outgoing") ? this.props.outgoingPayments : this.props.incomingPayments,
            }),
          });
        }}
        callbackMenu={() => {
          ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel Payment Series', 'Nevermind'],
            cancelButtonIndex: 1
          },
          (buttonIndex) => {
            if (buttonIndex == 0) {
              // Define strings to be displayed in alert
              var firstName = (this.props.activeFilter == "outgoing") ? payment.recip_name.split(" ")[0] : payment.sender_name.split(" ")[0],
                  purpose = StringMaster5000.formatPurpose(payment.purpose),
                  message;

              // Concatenate strings depending on payment flow direction
              if (this.props.currentUser.uid == payment.sender_id) message = "You'll stop paying " + firstName + " " + purpose;
              else message = firstName + " will stop paying you " + purpose;

              // Alert the user
              Alert.confirmation({
                title: "Are you sure you'd like to cancel this payment?",
                message: message,
                cancelMessage: "Nevermind",
                confirmMessage: "Yes please",
                cancel: () => console.log("Nevermind"),
                confirm: () => this.props.cancelPayment({
                  pid: payment.pid,
                  token: this.props.currentUser.token,
                  ds: (this.props.activeFilter == "outgoing") ? this.props.outgoingPayments : this.props.incomingPayments,
                })
              });
            }
          });
        }}/>
    );
  }

  render() {
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
            callbackPay={() => Actions.CreatePaymentViewContainer()} />
        </View>

      </View>
    );
  }
}

export default Payments;