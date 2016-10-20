// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, ListView, RecyclerViewBackedScrollView, Modal, StatusBar, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';

// Helper functions
import * as Alert from "../../helpers/Alert";
import * as Lambda from "../../services/Lambda";
import * as Init from '../../_init';

// Components
import FundingSource from '../../components/FundingSource/FundingSource.js';
import IAVWebView from '../../components/IAVWebView/IAVWebView';
import MicrodepositOnboarding from '../../components/MicrodepositOnboarding/MicrodepositOnboarding';
import BankOnboardingView from '../../modules/BankOnboarding/BankOnboardingView';

// Custom stylesheets
import colors from "../../styles/colors";
const dimensions = Dimensions.get('window');

class FundingSources extends React.Component {
  constructor(props) {
    super(props);
    this.EMPTY_DATA_SOURCE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      IAVModalVisible: false,
      microdepositModalVisible: false,
      dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows([])
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("<FundingSources /> will receive props", nextProps);
    this.setState({
      modalVisible: (this.state.modalVisible && nextProps.currentUser.bankAccount) ? false : this.state.modalVisible,
      dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows((nextProps.currentUser.bankAccount) ? [nextProps.currentUser.bankAccount] : [])
    });
  }

  _toggleIAVModal() {
    this.setState({ IAVModalVisible: !this.state.IAVModalVisible });
  }

  _toggleMicrodepositModal() {
    this.setState({ microdepositModalVisible: !this.state.microdepositModalVisible });
  }

  _renderRow(f) {
    return(
      <FundingSource
        currentUser={this.props.currentUser}
        fundingSource={f}
        optimisticallyRemoveFundingSource={() => {
          this.setState({ dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows([]) });
          this.props.currentUser.update({ fundingSource: null, bankAccount: null });
        }} />
    );
  }

  _getFundingSourceList() {
    return(
      <View style={{flex: 0.9, paddingTop: 0, backgroundColor: colors.richBlack}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          enableEmptySections />
      </View>
    );
  }

  _getMicrodepositReminder() {
    return(
      <View style={{flex: 0.9, paddingTop: 0, backgroundColor: colors.richBlack, justifyContent: 'flex-start', alignItems: 'center'}}>
        <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', color: colors.white, textAlign: 'center', padding: 15 }}>
          { "We're making two small deposits to your bank account to make sure you are who you say you are." }
        </Text>

        <View>
          { /* Verify microdeposits button */ }
          <TouchableHighlight
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this._toggleMicrodepositModal()}>

            <View style={{
              width: dimensions.width,
              flexDirection: 'row',
              alignItems: 'center',
              height: 60,
              flex: 0.5,
              backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              { /* Text */ }
              <View style={{ flex: 0.9, paddingLeft: 15 }}>
                <Text style={{ fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', color: colors.white }}>
                  { "Verify microdeposits" }
                </Text>
              </View>

              { /* Chevron */ }
              <View style={{ flex: 0.1, paddingRight: 15 }}>
                <Entypo name={"chevron-thin-right"} size={20} color={colors.accent} />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  /**
    *   Returns a ready-to-render empty state view
  **/
  _getEmptyState() {
    return(
      <View style={{flex: 0.9, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.richBlack}}>
        <Text style={{fontSize: 18, color: colors.accent}}>No funding sources. Add one now!</Text>
      </View>
    );
  }


  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.richBlack}}>
        { /* 'Add a new bank account' button */ }
        <TouchableHighlight
          underlayColor={colors.richBlack}
          activeOpacity={0.7}
          onPress={() => {
            if (this.props.currentUser.bankAccount) {
              Alert.message({
                title: "Unfortunately...",
                message: "Payper doesn't currently support multiple bank accounts. This feature will be available soon!",
              });
            } else {
              this._toggleIAVModal();
            }
          }}>

          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: colors.richBlack, borderBottomWidth: 1.0, borderBottomColor: colors.accent}}>
            <Entypo name="plus" size={30} color={colors.accent} />
            <Text style={{fontFamily: 'Roboto', fontWeight: '100', fontSize: 16, paddingLeft: 10, color: colors.accent}}>
              Add a new bank acount
            </Text>
          </View>
        </TouchableHighlight>

        { /* Render list of notifications or empty state */
          (this.props.currentUser.appFlags.onboarding_state === "awaitingMicrodepositVerification")
          ? this._getMicrodepositReminder()
          : this._getFundingSourceList() }

        { /* IAV modal */ }
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.IAVModalVisible}>

          <IAVWebView refreshable
            IAVToken={this.props.currentUser.IAVToken}
            firebaseToken={this.props.currentUser.token}
            currentUser={this.props.currentUser}
            toggleModal={() => this._toggleIAVModal()} />

        </Modal>

        { /* Microdeposit modal */ }
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.microdepositModalVisible}>

          <View style={{ flex: 1.0, marginTop: 20 }}>
            <MicrodepositOnboarding toggleModal={() => this._toggleMicrodepositModal()} />
          </View>

        </Modal>
      </View>
    );
  }
}

export default FundingSources;
