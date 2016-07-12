import React from 'react';
import {View, Text, TextInput, StyleSheet, Animated, Image, AsyncStorage, ListView, RecyclerViewBackedScrollView} from "react-native";
import Button from "react-native-button";
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';

// Helper functions
import * as Animations from "../../helpers/animations";
import * as Validators from "../../helpers/validators";
import * as Firebase from "../../services/Firebase";

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
    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
        },
        index: null,
        numCircles: null,
      },

      dataSourceOut: ds.cloneWithRows([]),
      dataSourceIn: ds.cloneWithRows([]),
    }
  }


  /**
    *   Populate dataSource with this user's transactions
  **/
  _genRows(whichFlow) {

    var _this = this,
        inc = [],
        out = [];

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    try {
      // Fetch payment flows from AsyncStorage
      AsyncStorage.getItem('@Store:payment_flow').then(function(flows) {

        // Populate row arrays
        flows = JSON.parse(flows);
        for (var payment in flows.in) inc.push( flows.in[payment] );
        for (var payment in flows.out) out.push( flows.out[payment] );

        // Set state depending on which filter is enabled
        switch (whichFlow) {
          case "in":
            _this.setState({dataSourceIn: ds.cloneWithRows(inc)});
          break;
          case "out":
            _this.setState({dataSourceOut: ds.cloneWithRows(out)});
          break;
        }
      });
    } catch (err) {
      console.log("Error getting payment flows from AsyncStorage", err);
    }
  }


  /**
    *   Return a list of ready to render rows
  **/
  _renderRow(payment) {
    return(
      <Transaction payment={payment} />
    )
  }

  componentWillMount() {
    this._genRows("out");
  }

  render() {

    switch (this.state.tab) {
      case "tracking":
        return (
          <View style={{flex: 1, backgroundColor: colors.white}}>

            <ListView
              style={{paddingTop: 66.5, marginBottom: 65.5}}
              dataSource={(this.state.flowFilter == "out") ? this.state.dataSourceOut : this.state.dataSourceIn }
              renderRow={this._renderRow}
              renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />} />

            <Header
              dark
              headerProps={this.state.headerProps} />

            <Footer
              callbackFeed={() => console.log("FEED")}
              callbackTracking={() => console.log("TRACKING")} />

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
