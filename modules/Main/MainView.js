import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, AsyncStorage, ListView, RecyclerViewBackedScrollView, RefreshControl} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';

// Helper functions
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Async from "../../helpers/Async";
import * as Firebase from "../../services/Firebase";
import * as Init from "../../_init";

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

class Main extends React.Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      tab: 'tracking',
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

    Async.get('user', (user) => {
      Firebase.listenToPaymentFlow(JSON.parse(user).uid, (type, payment) => {
        console.log("Type:", type);
        console.log("Payment:", payment);
        this._addRow(type, payment);
      });
    });
  }


  /**
    *   Populate dataSource with this user's transactions
  **/
  _genRows(whichFlow) {

    var _this = this,
        inc = [],
        out = [];

    try {
      // Fetch payment flows from AsyncStorage
      Async.get('payment_flow', (flows) => {
        flows = JSON.parse(flows);

        // Populate row arrays
        if (flows) {
          for (var payment in flows.in) inc.push( flows.in[payment] );
          for (var payment in flows.out) out.push( flows.out[payment] );
        }

        // Set state depending on which filter is enabled
        switch (whichFlow) {
          case "in":
            _this.setState({dataSourceIn: this.state.dataSourceIn.cloneWithRows(inc)});
          break;
          case "out":
            _this.setState({dataSourceOut: this.state.dataSourceOut.cloneWithRows(out)});
          break;
        }
      });
    } catch (err) {
      console.log("Error getting payment flows from AsyncStorage", err);
    }
  }


  /**
    *   Add a new payment row
  **/
  _addRow(flow, snapshot) {
    var arr = [];

    switch(flow) {
      case "in":
        for (var payment in snapshot) arr.push(snapshot[payment]);
        arr.sort(function(a, b) {
          return parseFloat(a.nextPayment) - parseFloat(b.nextPayment);
        });
        this.setState({dataSourceIn: this.state.dataSourceIn.cloneWithRows(arr)});
      break;
      case "out":
        for (var payment in snapshot) arr.push(snapshot[payment]);
        arr.sort(function(a, b) {
          return parseFloat(a.nextPayment) - parseFloat(b.nextPayment);
        });
        this.setState({dataSourceOut: this.state.dataSourceOut.cloneWithRows(arr)});
      break;
    }
  }


  /**
    *   Return a list of ready to render rows
  **/
  _renderRow(payment) {
    if (this.state.flowFilter == "out") return <Transaction out payment={payment} />;
    else return <Transaction inc payment={payment} />;
  }


  /**
    *
  **/
  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
    // this._genRows().then(() => {
    //   this.setState({refreshing: false});
    // });
  }


  componentWillMount() {
    // this._genRows("out");
    Async.get('user', (val) => {
      console.log("USER: " + val);
    });
  }

  render() {

    switch (this.state.tab) {
      case "tracking":
        return (
          <View style={{flex: 1, backgroundColor: colors.white}}>

            <View style={{flex: 0.1}}>
              <Header
                dark
                headerProps={this.state.headerProps}
                callbackOut={ () => this.setState({flowFilter: 'out'}) }
                callbackIn={ () => this.setState({flowFilter: 'in'}) }
                callbackSettings={() => Init.signOut()} />
            </View>

            <View style={{flex: 0.8}}>
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

            <View style={{flex: 0.1}}>
              <Footer
                callbackFeed={() => console.log("FEED")}
                callbackTracking={() => console.log("TRACKING")}
                callbackPay={() => Actions.CreatePaymentViewContainer()} />
            </View>

          </View>
        );
      break;
      case "feed":

      break;
      case "empty":
        return(
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white}}>
            <Text style={{fontSize: 18, color: colors.darkGrey}}>Empty state baby!</Text>
          </View>
        );
      break;
    }
  }
}

export default Main;
