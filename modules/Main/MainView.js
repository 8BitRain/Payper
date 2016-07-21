import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, AsyncStorage, ListView, RecyclerViewBackedScrollView, RefreshControl, Dimensions, StatusBar} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import SideMenu from 'react-native-side-menu';

// Helper functions
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Async from "../../helpers/Async";
import * as Firebase from "../../services/Firebase";
import * as Init from "../../_init";
import * as Lambda from "../../services/Lambda";

// Custom stylesheets
import containers from "../../styles/containers";
import typography from "../../styles/typography";
import colors from "../../styles/colors";

// Iconography
import Entypo from 'react-native-vector-icons/Entypo';

// Partial components
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import Transaction from '../../components/Previews/Transaction/Transaction.js';
import Settings from '../../modules/Settings/Settings.js';
import Notifications from '../../modules/Notifications/Notifications.js';

var dimensions = Dimensions.get('window');

class Content extends React.Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      tab: "tracking",
      empty: true,
      flowFilter: 'out',

      // Props to be passed to the Header
      headerProps: {
        types: {
          "paymentIcons": false,
          "circleIcons": false,
          "settingsIcon": true,
          "closeIcon": false,
          "flowTabs": true,
        },
        index: null,
        numCircles: null,
      },

      dataSourceOut: ds.cloneWithRows([]),
      dataSourceIn: ds.cloneWithRows([]),
      refreshing: false,
    }

    // Initialize Firebase listeners on this user's payment flow
    Async.get('user', (user) => {
      Firebase.listenToPaymentFlow(JSON.parse(user).uid, (type, payment) => {
        this._genRows(type, payment);
      });
    });

    // Log session token to our state
    Async.get('session_token', (token) => {
      this.setState({token: token});
    });
  }


  /**
    *   1) Confirm the cancel request
    *   2) Cancel the specified payment
  **/
  cancelPayment(pid) {
    Lambda.cancelPayment({payment_id: pid, token: this.state.token}, (success) => {
      console.log("Cancel payment was a", success);
    });
  }


  /**
    *   Confirm the specified payment
  **/
  confirmPayment(pid) {
    Lambda.confirmPayment({payment_id: pid, token: this.state.token}, (success) => {
      console.log("Confirm payment was a", success);
    });
  }


  /**
    *   Confirm the specified payment
  **/
  rejectPayment(pid) {
    Lambda.rejectPayment({payment_id: pid, token: this.state.token}, (success) => {
      console.log("Reject payment was a", success);
    });
  }


  /**
    *   Add a new payment row
  **/
  _genRows(flow, snapshot) {
    this.setState({empty: false});

    // Attach payment id to payment object, append it to payments arr
    var payments = [];
    for (var paymentID in snapshot) {
      snapshot[paymentID].pid = paymentID;
      payments.push(snapshot[paymentID]);
    }

    // Sort payments so that soonest next payment appears at front
    payments.sort(function(a, b) {
      return parseFloat(a.nextPayment) - parseFloat(b.nextPayment);
    });

    // Set state, triggering re-rerender of list
    (flow == "in")
      ? this.setState({dataSourceIn: this.state.dataSourceIn.cloneWithRows(payments)})
      : this.setState({dataSourceOut: this.state.dataSourceOut.cloneWithRows(payments)});
  }


  /**
    *   Return a list of ready to render rows
  **/
  _renderRow(payment) {
    return(
      <Transaction
        out={this.state.flowFilter == "out"}
        payment={payment}
        callbackCancel={() => this.cancelPayment(payment.pid)}
        callbackConfirm={() => this.confirmPayment(payment.pid)}
        callbackReject={() => this.rejectPayment(payment.pid)} />
    );
  }


  /**
    *   TODO:
    *   Implement actual refresh events here
  **/
  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 750);
  }


  /**
    *   Returns a ready-to-render payment ListView
  **/
  _getPaymentList() {
    return(
      <View style={{flex: 0.81, paddingTop: 0}}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
              colors={[colors.darkGrey]}
              tintColor={colors.darkGrey}
            />
          }
          dataSource={(this.state.flowFilter == "out") ? this.state.dataSourceOut : this.state.dataSourceIn }
          renderRow={this._renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          enableEmptySections />
      </View>
    );
  }


  /**
    *   Returns a ready-to-render empty state view
  **/
  _getEmptyState() {
    return(
      <View style={{flex: 0.81, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white}}>
        <Text style={{fontSize: 18, color: colors.darkGrey}}>Empty state baby!</Text>
      </View>
    );
  }


  render() {
    /* If a settings page is active, render it */
    switch (this.props.settingsPage) {
      case "notifications":
        return(
          <View style={{flex: 1, backgroundColor: colors.white}}>
            { /* Header */ }
            <View style={{flex: 0.1}}>
              <Header
                headerProps={{
                  types: {
                    "paymentIcons": false,
                    "circleIcons": false,
                    "settingsIcon": true,
                    "closeIcon": false,
                    "flowTabs": false,
                  },
                  index: null,
                  numCircles: null,
                  title: "Notifications",
                }}
                callbackSettings={() => this.props.toggleMenu()} />
            </View>

            { /* Global feed */ }
            <View style={{flex: 0.9}}>
              <Notifications />
            </View>
          </View>
        );
      break;

      /* If no settings page is active, render a MainView page */
      default:
      switch (this.state.tab) {
        case "tracking":
          return (
            <View style={{flex: 1, backgroundColor: colors.white}}>

              { /* Header */ }
              <View style={{flex: 0.1}}>
                <Header
                  headerProps={this.state.headerProps}
                  callbackOut={ () => this.setState({flowFilter: 'out'}) }
                  callbackIn={ () => this.setState({flowFilter: 'in'}) }
                  callbackSettings={() => this.props.toggleMenu()} />
              </View>

              { /* Render list of payments or empty state */  }
              {(this.state.empty) ? this._getEmptyState() : this._getPaymentList() }

              { /* Footer */ }
              <View style={{flex: 0.09}}>
                <Footer
                  callbackFeed={() => this.setState({tab: 'feed'})}
                  callbackTracking={() => console.log("Tracking tab is already active.")}
                  callbackPay={() => Actions.CreatePaymentViewContainer()} />
              </View>
            </View>
          );
        break;
        case "feed":
          return(
            <View style={{flex: 1, backgroundColor: colors.white}}>

              { /* Header */ }
              <View style={{flex: 0.1}}>
                <Header
                  headerProps={this.state.headerProps}
                  callbackOut={ () => this.setState({flowFilter: 'out'}) }
                  callbackIn={ () => this.setState({flowFilter: 'in'}) }
                  callbackSettings={() => this.props.toggleMenu()} />
              </View>

              { /* Global feed */ }
              <View style={{flex: 0.81, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'}}></View>

              { /* Footer */ }
              <View style={{flex: 0.09}}>
                <Footer
                  callbackFeed={() => console.log("Feed tab is already active.")}
                  callbackTracking={() => this.setState({tab: 'tracking'})}
                  callbackPay={() => Actions.CreatePaymentViewContainer()} />
              </View>
            </View>
          );
        break;
      }
    }
  }
}


class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      page: "",
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen, });
  }

  changePage(newPage) {
    this.setState({page: newPage, isOpen: !this.state.isOpen});
  }

  render() {
    var menu = <Settings changePage={(newPage) => this.changePage(newPage)} />;

    return (
      <SideMenu
        bounceBackOnOverdraw={false}
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={(isOpen) => this.updateMenuState(isOpen)}
        disableGestures={true}>

        <StatusBar barStyle="light-content" />
        <Content settingsPage={this.state.page} toggleMenu={() => this.toggle()} />

      </SideMenu>
    );
  }
}

export default Main;
