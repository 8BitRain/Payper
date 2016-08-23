// Dependencies
import React from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableHighlight, ListView, DataSource, RecyclerViewBackedScrollView, Button } from 'react-native';

// Helper functions
import * as Lambda from '../../services/Lambda';
import * as Timestamp from '../../helpers/Timestamp';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as SetMaster5000 from '../../helpers/SetMaster5000';

// Partial components
import UserPicWithCallback from '../../components/Previews/UserPic/UserPicWithCallback';

// Custom stylesheets
import colors from '../../styles/colors';
const dimensions = Dimensions.get('window');
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto',
    fontSize: 20,
    paddingLeft: 20,
    color: colors.richBlack,
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 15,
    paddingLeft: 20,
    color: colors.richBlack,
    backgroundColor: 'transparent',
  },
});

// Cloned for profile options list view
const EMPTY_DATA_SOURCE = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.options = [
      { rowTitle: "Display Name",
        rowContent: this.props.currentUser.first_name + " " + this.props.currentUser.last_name,
        sectionTitle: "My Profile",
        destination: () => console.log("Display Name:", this.props.currentUser.first_name + " " + this.props.currentUser.last_name) },
      { rowTitle: "Username",
        rowContent: this.props.currentUser.username,
        sectionTitle: "My Profile",
        destination: () => console.log("Username:", this.props.currentUser.username) },
      { rowTitle: "Phone Number",
        rowContent: StringMaster5000.stylizePhoneNumber(this.props.currentUser.decryptedPhone),
        sectionTitle: "My Profile",
        destination: () => console.log("Phone Number:", this.props.currentUser.phone)},
      { rowTitle: "Email",
        rowContent: this.props.currentUser.decryptedEmail,
        sectionTitle: "My Profile",
        destination: () => console.log("Email:", this.props.currentUser.email)},
    ];
  }


  _renderOptionsList() {
    return(
      <View style={{flex: 1.0}}>
        <ListView
          dataSource={EMPTY_DATA_SOURCE.cloneWithRowsAndSections(SetMaster5000.arrayToMap(this.options))}
          renderRow={this._renderRow.bind(this)}
          renderSectionHeader={this._renderSectionHeader}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          enableEmptySections />
      </View>
    );
  }


  _renderRow(row) {
    return(
      <TouchableHighlight
        activeOpacity={0.7}
        underlayColor={'transparent'}
        onPress={() => row.destination()}>

        <View style={{height: 45, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, paddingLeft: 20, borderBottomWidth: 0.8, borderBottomColor: colors.lightGrey}}>
          <View style={{flex: 0.5}}>
            <Text style={{alignSelf: 'flex-start'}}>{ row.rowTitle }</Text>
          </View>
          <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text>{ row.rowContent }</Text>
            <View style={{borderColor: colors.accent, borderWidth: 1.0, padding: 3, borderRadius: 3, marginLeft: 10}}>
              <Text style={{fontFamily: 'Roboto', fontSize: 10}}>{ (row.rowContent) ? "Edit" : "Add" }</Text>
            </View>
          </View>
        </View>

      </TouchableHighlight>
    );
  }


  _renderSectionHeader(sectionData, sectionTitle) {
    return(
      <View style={{height: 30, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, paddingLeft: 20, backgroundColor: colors.offWhite}}>
        <Text>{ sectionTitle }</Text>
      </View>
    );
  }


  render() {
    return (
      <View style={{flex: 1.0, backgroundColor: colors.white, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

        { /* Header */ }
        <View style={{flex: 0.23, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: dimensions.width, backgroundColor: colors.accent}}>
          <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
            <View style={{flex: 0.5, backgroundColor: colors.accent}} />
            <View style={{flex: 0.5, backgroundColor: colors.white}} />
          </View>

          { /* Profile picture */ }
          <View style={{position: 'absolute', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, right: 0, bottom: 0}}>
            <UserPicWithCallback
              callback={() => console.log("Change image")}
              accent
              user={this.props.currentUser}
              width={110}
              height={110} />
          </View>
        </View>

        { /* Profile info */ }
        <View style={{flex: 0.77, width: dimensions.width, backgroundColor: colors.white}}>
          { this._renderOptionsList() }
        </View>
      </View>
    );
  }
}

export default Profile;
