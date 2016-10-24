// Dependencies
import React from 'react';
import { View, Text, StatusBar, Dimensions, ListView } from 'react-native';
import Mixpanel from 'react-native-mixpanel';
import SideMenu from 'react-native-side-menu';
import * as Headers from '../../helpers/Headers';

// Components
import Header from '../../components/Header/Header';
import Settings from '../../modules/Settings/SettingsView';
import Payments from '../../modules/Payments/PaymentsView';
import Profile from '../../modules/Profile/ProfileView';
import Notifications from '../../modules/Notifications/NotificationsView';
import FundingSources from '../../modules/FundingSources/FundingSourcesView';
import Invite from '../../modules/Invite/InviteView';

// Stylesheets
import colors from '../../styles/colors';
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
        return <Notifications {...this.props} />;
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
    this.state = {
      currentPage: "payments",
      headerProps: Headers.get({ header: "payments",
          setActiveFilterToIncoming: () => this.setState({ activeFilter: "incoming" }),
          setActiveFilterToOutgoing: () => this.setState({ activeFilter: "outgoing" }) }),
      activeFilter: "incoming",
      sideMenuIsOpen: false,
      incomingPayments: this.EMPTY_DATA_SOURCE.cloneWithRows([]),
      outgoingPayments: this.EMPTY_DATA_SOURCE.cloneWithRows([])
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.paymentFlow) {
      this.setState({
        incomingPayments: this.EMPTY_DATA_SOURCE.cloneWithRows((nextProps.currentUser.paymentFlow.in) ? nextProps.currentUser.paymentFlow.in : []),
        outgoingPayments: this.EMPTY_DATA_SOURCE.cloneWithRows((nextProps.currentUser.paymentFlow.out) ? nextProps.currentUser.paymentFlow.out : [])
      });
    }
  }

  componentWillMount() {
    // Reattach listeners if they're already active
    if (this.props.currentUser.endpoints) this.props.currentUser.stopListening();
    this.props.currentUser.startListening((updates) => this.props.updateCurrentUser(updates));

    // Get decrypted email and phone attributes
    this.props.currentUser.decrypt((updates) => this.props.updateCurrentUser(updates));

    // Prompt user for contact access
    this.props.currentUser.getNativeContacts((updates) => this.props.updateCurrentUser(updates));
  }

  toggleSideMenu() {
    this.setState({ sideMenuIsOpen: !this.state.sideMenuIsOpen });
  }

  changePage(newPage) {
    if (newPage === this.state.currentPage) return;

    // Track page change in Mixpanel
    Mixpanel.trackWithProperties("Page Switch", {
      from: this.state.currentPage,
      to: newPage
    });

    // Determine which header to render
    var headerParams = (newPage === 'payments')
      ? { header: newPage,
          setActiveFilterToIncoming: () => this.setState({ activeFilter: "incoming" }),
          setActiveFilterToOutgoing: () => this.setState({ activeFilter: "outgoing" }) }
      : { header: newPage };

    // Trigger re-render
    this.setState({
      currentPage: newPage,
      headerProps: Headers.get(headerParams)
    });

    // Close side menu
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
        isOpen={this.state.sideMenuIsOpen}
        onChange={(isOpen) => this.setState({ sideMenuIsOpen: isOpen })}
        disableGestures={false}>

        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Main page content wrap */ }
        <View style={{flex: 1.0}}>
          <View style={{ flex: 0.12, backgroundColor: colors.richBlack }}>
            <Header {...this.props}
              activeFilter={this.state.activeFilter}
              headerProps={this.state.headerProps}
              callbackSettings={() => this.toggleSideMenu()} />
          </View>

          { /* Inner content */ }
          <View style={{ flex: 0.88 }}>
            <InnerContent {...this.props}
              previousPage={this.state.previousPage}
              currentPage={this.state.currentPage}
              activeFilter={this.state.activeFilter}
              outgoingPayments={this.state.outgoingPayments}
              incomingPayments={this.state.incomingPayments}
              setActiveFilter={(newFilter) => this.setActiveFilter(newFilter)}/>
          </View>
        </View>
      </SideMenu>
    );
  }
}
