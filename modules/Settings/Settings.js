import React from 'react';
import {View, Text, Image, AsyncStorage, ListView, RecyclerViewBackedScrollView, TouchableHighlight} from "react-native";
import {Actions} from 'react-native-router-flux';

// Helper functions
import * as Async from "../../helpers/Async";
import * as Partials from '../../helpers/Partials';
import * as Init from '../../_init';

// Custom stylesheets
import colors from "../../styles/colors";
import styles from "../../styles/Settings/Settings";

// Iconography
import Entypo from 'react-native-vector-icons/Entypo';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows([
        {rowTitle: "Payment History", iconName: "line-graph", destination: Actions.CreateAccountViewContainer},
        {rowTitle: "FAQ", iconName: "help-with-circle", destination: Actions.CreateAccountViewContainer},
        {rowTitle: "Sign Out", iconName: "moon", destination: Init.signOut},
      ]),
    }
  }


  /**
    *   Return a list of ready to render rows
  **/
  _renderRow(options) {
    return(
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={'transparent'}
        onPress={() => options.destination()}
        style={{borderBottomWidth: 1, borderBottomColor: colors.white}}>
        <View style={styles.row}>
          <Entypo style={styles.icon} name={options.iconName} size={20} color={colors.icyBlue} />
          <Text style={styles.rowTitle}>{ options.rowTitle }</Text>
        </View>
      </TouchableHighlight>
    );
  }


  /**
    *   Returns a ready-to-render payment ListView
  **/
  _getSettingsList() {
    return(
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        enableEmptySections />
    );
  }


  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.darkGrey}}>
        { /* Header */ }
        <TouchableHighlight
          activeOpacity={0.7}
          underlayColor={'transparent'}
          onPress={() => console.log("EDIT PROFILE")}
          style={{borderBottomWidth: 1, borderBottomColor: colors.icyBlue}}>
          <View style={{height: 70, marginTop: 30, paddingBottom: 12.5, paddingLeft: 20, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.icyBlue}}>
            { Partials.getUserPic("", "Brady Sheridan") }
            <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text style={[styles.rowTitle, {fontSize: 18, paddingLeft: 0}]}>Brady Sheridan</Text>
              <Text style={[styles.rowTitle, {fontSize: 12, color: colors.icyBlue, paddingLeft: 0}]}>Edit profile</Text>
            </View>
          </View>
        </TouchableHighlight>

        { /* ListView */ }
        { this._getSettingsList() }
      </View>
    );
  }
}

export default Settings;
