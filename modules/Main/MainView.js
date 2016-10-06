// Dependencies
import React from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, TextInput, StatusBar, Dimensions } from 'react-native';
import SideMenu from 'react-native-side-menu';

// Helpers
import * as Init from '../../_init';

// Components
import Header from '../../components/Header/Header';
import Settings from '../../modules/Settings/SettingsView';
import Payments from '../../modules/Payments/PaymentsViewContainer';
import Profile from '../../modules/Profile/ProfileView';
import Notifications from '../../modules/Notifications/NotificationsViewContainer';
import FundingSources from '../../modules/FundingSources/FundingSourcesViewContainer';
import Invite from '../../modules/Invite/InviteViewContainer';
import SignIn from '../../modules/SignIn/SignInViewContainer';

// Used to determine header size
const dimensions = Dimensions.get('window');

class InnerContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    switch (this.props.currentPage) {

      case "payments":
        return <Payments {...this.props} />;
        break;

      case "profile":
        return <Profile {...this.props} />;
        break;

      case "notifications":
        return <Notifications />;
        break;

      case "fundingSources":
        return <FundingSources {...this.props} />;
        break;

      case "invite":
        return <Invite {...this.props} />;
        break;

      default:
        return(
          <View style={{flex: 1.0, backgroundColor: "#000", justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 16, color: '#FFF'}}>
              { "Failed to render a page.\nCheck <InnerContent /> render\nfunction in MainView.js" }
            </Text>
          </View>
        );
    }
  }
}


export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.currentUser.startListening((updates) => this.props.updateCurrentUser(updates));
  }

  toggleSideMenu() {
    this.props.setSideMenuIsOpen(!this.props.sideMenuIsOpen);
  }

  changePage(newPage) {
    this.props.setCurrentPage(newPage);
    this.toggleSideMenu();
  }

  render() {

    return (
      <SideMenu
        menu={ <Settings {...this.props} changePage={(newPage) => this.changePage(newPage)} /> }
        bounceBackOnOverdraw={false}
        isOpen={this.props.sideMenuIsOpen}
        onChange={(isOpen) => this.props.setSideMenuIsOpen(isOpen)}
        disableGestures={false}>

        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Main page content wrap */ }
        <View style={{flex: 1.0}}>
          <View style={{ flex: (dimensions.height < 667) ? 0.12 : 0.1 }}>
            <Header {...this.props} callbackSettings={ () => this.toggleSideMenu() } />
          </View>

          { /* Inner content */ }
          <View style={{ flex: (dimensions.height < 667) ? 0.88 : 0.9 }}>
            <InnerContent {...this.props} />
          </View>
        </View>
      </SideMenu>
    );
  }
}
