// Dependencies
import React from 'react';
import { View, Text, TextInput, StatusBar, Dimensions } from 'react-native';
import Actions from 'react-native-router-flux';
import SideMenu from 'react-native-side-menu';

// Components
import Header from '../../components/Header/Header';
import Settings from '../../modules/Settings/SettingsView';
import Payments from '../../modules/Payments/PaymentsViewContainer';
import Profile from '../../modules/Profile/ProfileView';
import Notifications from '../../modules/Notifications/NotificationsViewContainer';
import FundingSources from '../../modules/FundingSources/FundingSourcesView';

// Used to determine header size
const dimensions = Dimensions.get('window');

class InnerContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    console.log("%cGot props:", "color:purple;font-weight:900;");
    console.log(this.props)

    // Show sign in screen if user is not signed in
    if (!this.props.signedIn) return <SignIn />;

    // Otherwise, take the user to the app
    else if (this.props.signedIn) {
      switch (this.props.currentPage) {

        case "payments":
          return <Payments />;
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

        default:
          return(
            <View style={{flex: 1.0, backgroundColor: "#000", justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 16, color: '#FFF'}}>
                { "Failed to render a page.\nCheck InnerContent's render\nfunction in MainViewV2.js" }
              </Text>
            </View>
          );
      }
    }
  }
}


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderTrigger: Math.random(),
    };
  }

  componentWillMount() {
    if (!this.props.initialized) {
      console.log("%cInitializing MainView", "color:blue;font-weight:900;");

      // Initialize the app
      this.props.initialize((success) => {
        if (success) {
          var uid = this.props.currentUser.uid,
              notifications = "notifications/" + uid,
              appFlags = "appFlags/" + uid;

          // Initialize Firebase listeners
          this.props.listen([notifications, appFlags], (numUnseenNotifications) => {
            // Must explicitly trigger a re-render, otherwise side menu's
            // notification indicator will not update
            this.setState({renderTrigger: Math.random()});
          });

          console.log("%cInitialization succeeded. Current user:", "color:green;font-weight:900;");
          console.log(this.props.currentUser);
          console.log("%cCurrent appFlags:", "color:green;font-weight:900;");
          console.log(this.props);
        } else {
          console.log("%cInitialization failed.", "color:red;font-weight:900;");
        }
      });
    }
  }


  componentWillUnmount() {
    // Disable Firebase listeners
    this.props.stopListening(this.props.activeFirebaseListeners);
  }


  // Open & close side menu
  toggle() {
    this.props.setSideMenuIsOpen(!this.props.sideMenuIsOpen);
  }


  // Switch page to be rendered in <InnerContent />
  changePage(newPage) {
    this.props.setCurrentPage(newPage);
  }


  render() {
    // Must explicitly trigger a re-render, otherwise side menu's
    // notification indicator will not update
    if (this.props.signedIn) {
      return (
        <SideMenu
          key={this.state.renderTrigger}
          menu={ <Settings {...this.props} changePage={(newPage) => { this.changePage(newPage); this.toggle(); }} /> }
          bounceBackOnOverdraw={false}
          isOpen={this.props.sideMenuIsOpen}
          onChange={(isOpen) => this.props.setSideMenuIsOpen(isOpen)}
          disableGestures={false}>

          { /* Lighten status bar text */ }
          <StatusBar barStyle="light-content" />

          { /* Main page content wrap */ }
          <View style={{flex: 1.0}}>
            { /* Header */ }
            <View style={{ flex: (dimensions.height < 667) ? 0.12 : 0.1 }}>
              <Header
                callbackSettings={ () => this.toggle() }
                numUnseenNotifications={ this.props.numUnseenNotifications }
                headerProps={ this.props.header } />
            </View>

            { /* Inner content */ }
            <View style={{ flex: (dimensions.height < 667) ? 0.88 : 0.9 }}>
              <InnerContent { ...this.props } />
            </View>
          </View>

        </SideMenu>
      );
    } else {
      return(
        <View style={{flex: 1.0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'}}>
          <Text style={{fontSize: 20, color: 'white'}}>Not signed in</Text>
        </View>
      );
    }
  }
}

export default Main;
