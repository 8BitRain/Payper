// Dependencies
import React from 'react';
import { View, Text, Dimensions, StyleSheet, Modal, TouchableHighlight, ListView, DataSource, RecyclerViewBackedScrollView, Button, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';

// Helper functions
import * as Lambda from '../../services/Lambda';
import * as Timestamp from '../../helpers/Timestamp';
import * as StringMaster5000 from '../../helpers/StringMaster5000';
import * as SetMaster5000 from '../../helpers/SetMaster5000';
import * as Headers from '../../helpers/Headers';
import * as Alert from '../../helpers/Alert';
import * as Init from '../../_init';

// Partial components
import Header from '../../components/Header/Header';
import UserPicWithCallback from '../../components/Previews/UserPic/UserPicWithCallback';
import Edit from './Edit';

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
        destination: () => this._toggleModal({
          title: "Display Name",
          content: this.props.currentUser.first_name + " " + this.props.currentUser.last_name,
          info: "This is not currently editable."
      })},
      { rowTitle: "Username",
        rowContent: this.props.currentUser.username,
        sectionTitle: "My Profile",
        destination: () => this._toggleModal({
          title: "Username",
          content: this.props.currentUser.username,
          info: "This is not currently editable."
      })},
      { rowTitle: "Phone Number",
        rowContent: StringMaster5000.stylizePhoneNumber(this.props.currentUser.decryptedPhone),
        sectionTitle: "My Profile",
        destination: () => this._toggleModal({
          title: "Phone Number",
          content: this.props.currentUser.decryptedPhone,
          info: "Other Payper users will be able to find you by your phone number. We will not give your phone number away."
      })},
      { rowTitle: "Email",
        rowContent: this.props.currentUser.decryptedEmail,
        sectionTitle: "My Profile",
        destination: () => this._toggleModal({
          title: "Email",
          content: this.props.currentUser.decryptedEmail,
          info: "Your email address is used for password recovery and identity verification. Nobody can see this address but you."
      })},
      { rowTitle: "Delete Account",
        rowContent: "",
        sectionTitle: "My Profile",
        destination: () => this._deleteUser(),
      },
    ];

    // Populate blocked users, if any
    if (this.props.blockedUsers) {
      for (var u in this.props.blockedUsers) {
        const curr = this.props.blockedUsers[u];
        this.options.push({
          rowTitle: curr.first_name + " " + curr.last_name,
          rowContent: "",
          sectionTitle: "Blocked Users",
          uid: u,
          destination: () => this._unblockUser({ uid: u, name: curr.first_name + " " + curr.last_name })
        });
      }
    }

    this.state = {
      optionsDataSource: EMPTY_DATA_SOURCE.cloneWithRowsAndSections(SetMaster5000.arrayToMap(this.options)),
      modalVisible: false,
      modalProps: {
        title: "",
        value: "",
        info: "",
      },
    };
  }

  _deleteUser() {
    const _this = this;

    Alert.confirmation({
      title: "Delete Account",
      message: "Are you sure you'd like to delete your account? This CANNOT be undone!",
      cancelMessage: "Nevermind",
      confirmMessage: "Yes, delete my account",
      cancel: () => console.log("Nevermind"),
      confirm: () => {
        console.log("Deleting user with params:", { token: _this.props.currentUser.token, uid: _this.props.currentUser.uid });
        Init.signout();
        Init.deleteUser({ token: _this.props.currentUser.token, uid: _this.props.currentUser.uid });
        Actions.LandingScreenContainer();
      },
    });
  }

  _unblockUser(user) {
    // Extend scope
    const _this = this;

    // Determine alert contents
    var title = "Unblock " + user.name,
        message = "Are you sure you'd like to unblock this user?";

    // Request confirmation
    Alert.confirmation({
      title: title,
      message: message,
      confirmMessage: "Yes, unblock this user",
      cancelMessage: "Nevermind",
      confirm: () => {
        for (var o in this.options)
          if (this.options[o].uid && this.options[o].uid == user.uid)
            this.options.splice(o, 1);
        this.setState({ optionsDataSource: EMPTY_DATA_SOURCE.cloneWithRowsAndSections(SetMaster5000.arrayToMap(this.options)) });
      },
      cancel: () => {
        console.log("Nevermind");
      },
    })
  }


  /**
    *   Must explicitly trigger a re-render of the options screen to detect
    *   changes to the Redux user object
  **/
  _updateOptionsDataSource() {
    // Instantiate new options list
    var newOptions = [
      { rowTitle: "Display Name",
        rowContent: this.props.currentUser.first_name + " " + this.props.currentUser.last_name,
        sectionTitle: "My Profile",
        destination: () => this._toggleModal({
          title: "Display Name",
          content: this.props.currentUser.first_name + " " + this.props.currentUser.last_name,
          info: "This is this name you go by in app."
        })},
      { rowTitle: "Username",
        rowContent: this.props.currentUser.username,
        sectionTitle: "My Profile",
        destination: () => this._toggleModal({
          title: "Username",
          content: this.props.currentUser.username,
          info: "This is not currently editable."
        })},
      { rowTitle: "Phone Number",
        rowContent: StringMaster5000.stylizePhoneNumber(this.props.currentUser.decryptedPhone),
        sectionTitle: "My Profile",
        destination: () => this._toggleModal({
          title: "Phone Number",
          content: this.props.currentUser.decryptedPhone,
          info: "Other Payper users will be able to find you by your phone number. We will not give your phone number away."
        })},
      { rowTitle: "Email",
        rowContent: this.props.currentUser.decryptedEmail,
        sectionTitle: "My Profile",
        destination: () => this._toggleModal({
          title: "Email",
          content: this.props.currentUser.decryptedEmail,
          info: "Your email address is used for password recovery and identity verification. Nobody can see this address but you."
        })},
    ];

    // Change options in state, triggering re-render of ListView
    this.setState({ optionsDataSource: EMPTY_DATA_SOURCE.cloneWithRowsAndSections(SetMaster5000.arrayToMap(newOptions)) });
  }


  _renderOptionsList() {
    return(
      <View style={{flex: 1.0}}>
        <ListView
          dataSource={this.state.optionsDataSource}
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
            { (row.rowContent)
                ? <View style={{borderColor: colors.accent, borderWidth: 1.0, padding: 3, borderRadius: 3, marginLeft: 10}}>
                    <Text style={{fontFamily: 'Roboto', fontSize: 10}}>{ (row.sectionTitle == "Blocked Users") ? "Unblock" : "Edit" }</Text>
                  </View>
                : null }
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


  _toggleModal(options) {
    this.setState({
      modalProps: {
        title: (options) ? options.title : "",
        value: (options) ? options.content : "",
        info: (options) ? options.info : "",
      },
      modalVisible: !this.state.modalVisible,
    });
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
              height={110}
              style={{backgroundColor: 'red'}} />
          </View>
        </View>

        { /* Profile info */ }
        <View style={{flex: 0.77, width: dimensions.width, backgroundColor: colors.white}}>
          { this._renderOptionsList() }
        </View>

        { /* Modal containing edit panel */ }
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={ () => alert("Closed modal") }>

          { /* Lighten status bar text */ }
          <StatusBar barStyle="light-content" />

          <View style={{flex: 1.0}}>

            { /* Header */ }
            <View style={{ flex: (dimensions.height < 667) ? 0.12 : 0.1 }}>
              <Header
                callbackClose={ () => this._toggleModal() }
                headerProps={ Headers.editProfileHeader({ title: this.state.modalProps.title }) } />
            </View>

            { /* Edit panel */ }
            <View style={{ flex: (dimensions.height < 667) ? 0.88 : 0.9 }}>
              <Edit
                {...this.props}
                modalProps={this.state.modalProps}
                updateOptionsDataSource={() => this._updateOptionsDataSource()} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default Profile;
