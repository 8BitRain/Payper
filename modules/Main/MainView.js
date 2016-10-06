// Dependencies
import React from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, TextInput, StatusBar, Dimensions, ListView } from 'react-native';
import SideMenu from 'react-native-side-menu';
import * as Headers from '../../helpers/Headers';

// Helpers
import * as Init from '../../_init';

// Components
import Header from '../../components/Header/Header';
import Settings from '../../modules/Settings/SettingsView';
import Payments from '../../modules/Payments/PaymentsView';
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

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.headerCallbacks = {
      setActiveFilterToIncoming: () => this.setState({ activeFilter: "incoming" }),
      setActiveFilterToOutgoing: () => this.setState({ activeFilter: "outgoing" })
    };

    this.state = {
      currentPage: "payments",
      headerProps: Headers.get("payments", this.headerCallbacks),
      activeFilter: "incoming"
    };
  }

  componentWillMount() {
    this.props.currentUser.startListening((updates) => this.props.updateCurrentUser(updates));
  }

  toggleSideMenu() {
    this.props.setSideMenuIsOpen(!this.props.sideMenuIsOpen);
  }

  changePage(newPage) {
    this.setState({
      currentPage: newPage,
      headerProps: Headers.get(newPage, this.headerCallbacks)
    });
    this.toggleSideMenu();
  }

  setActiveFilter(newActiveFilter) {
    this.setState({ activeFilter: newActiveFilter });
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
            <Header {...this.props}
              activeFilter={this.state.activeFilter}
              headerProps={this.state.headerProps}
              callbackSettings={ () => this.toggleSideMenu() } />
          </View>

          { /* Inner content */ }
          <View style={{ flex: (dimensions.height < 667) ? 0.88 : 0.9 }}>
            <InnerContent {...this.props}
              activeFilter={this.state.activeFilter}
              currentPage={this.state.currentPage}
              outgoingPayments={this.EMPTY_DATA_SOURCE.cloneWithRows([])}
              incomingPayments={this.EMPTY_DATA_SOURCE.cloneWithRows([])} />
          </View>
        </View>
      </SideMenu>
    );
  }
}
