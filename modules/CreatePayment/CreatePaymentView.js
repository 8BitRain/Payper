// Dependencies
import React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Animated, Easing } from 'react-native';
import { Actions } from 'react-native-router-flux';

// Helpers
import * as Headers from '../../helpers/Headers';

// Components
import Header from '../../components/Header/Header';
import UserSelection from './pages/UserSelection';
import AmountAndDuration from './pages/AmountAndDuration';
import Purpose from './pages/Purpose';

// Stylesheets
import colors from '../../styles/colors';

// Used to size user previews
const dimensions = Dimensions.get('window');

class CreatePaymentView extends React.Component {
  constructor(props) {
    super(props);

    this.pages = ["user", "amount", "purpose"];

    this.state = {
      pageIndex: 0,
      header: Headers.createPaymentHeader(),
      offsetX: new Animated.Value(0),
      selectedContacts: {},
    };
  }

  componentWillMount() {
    this.props.setToken(this.props.currentUser.token);
  }

  _induceState(options) {
    this.setState({ selectedContacts: options.selectedContacts });
  }

  _setHeader() {
    if (this.pages[this.state.pageIndex] == "purpose") this.setState({ header: Headers.createPaymentPurposeHeader({ callbackBack: () => this._prevPage() }) });
    else this.setState({ header: Headers.createPaymentHeader() });
  }

  _nextPage() {
    this.setState({ pageIndex: this.state.pageIndex + 1 });
    this._setHeader();
    Animated.timing(this.state.offsetX, {
      toValue: this.state.offsetX._value - dimensions.width,
      duration: 100,
      easing: Easing.cubic,
    }).start();
  }

  _prevPage() {
    this.setState({ pageIndex: this.state.pageIndex - 1 });
    this._setHeader();
    Animated.timing(this.state.offsetX, {
      toValue: this.state.offsetX._value + dimensions.width,
      duration: 100,
      easing: Easing.cubic,
    }).start();
  }

  render() {
    return (
      <View style={{flex: 1.0}}>
        { /* Lighten status bar text */ }
        <StatusBar barStyle="light-content" />

        { /* Header */ }
        <View style={{ flex: (dimensions.height < 667) ? 0.12 : 0.1 }}>
          <Header
            callbackClose={ () => { this.props.reset(); this.props.toggleModal(); }}
            callbackBack={ () => this._setPageIndex(1) }
            numUnseenNotifications={ this.props.numUnseenNotifications }
            headerProps={ this.state.header } />
        </View>

        { /* Inner content */ }
        <View style={{ flex: (dimensions.height < 667) ? 0.88 : 0.9 }}>
          <Animated.View style={[styles.allPanelsWrap, { marginLeft: this.state.offsetX }]}>
            { /* User selection */ }
            <View style={[styles.panelWrap]}>
              <UserSelection
                {...this.props}
                induceState={(options) => this._induceState(options)}
                nextPage={() => this._nextPage()} />
            </View>

            { /* Amount and duration */ }
            <View style={[styles.panelWrap]}>
              <AmountAndDuration
                {...this.props}
                selectedContacts={this.state.selectedContacts}
                nextPage={() => this._nextPage()}
                prevPage={() => this._prevPage()} />
            </View>

            { /* Purpose */ }
            <View style={[styles.panelWrap]}>
              <Purpose
                {...this.props}
                selectedContacts={this.state.selectedContacts}
                prevPage={() => this._prevPage()} />
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  allPanelsWrap: {
    flexDirection: 'row',
    flex: 1.0,
    width: dimensions.width * 3.0,
  },
  panelWrap: {
  },
});

export default CreatePaymentView;
