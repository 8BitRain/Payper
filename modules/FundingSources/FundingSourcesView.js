// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, ListView, RecyclerViewBackedScrollView, Modal, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';

// Helper functions
import * as Alert from "../../helpers/Alert";
import * as Lambda from "../../services/Lambda";
import * as Init from '../../_init';

// Components
import FundingSource from '../../components/FundingSource/FundingSource.js';
import IAVWebView from '../../components/IAVWebView/IAVWebView';
import BankOnboardingView from '../../modules/BankOnboarding/BankOnboardingView';

// Custom stylesheets
import colors from "../../styles/colors";

class FundingSources extends React.Component {
  constructor(props) {
    super(props);
    this.EMPTY_DATA_SOURCE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      modalVisible: false,
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

  _toggleModal() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  _renderRow(f) {
    return(
      <FundingSource
        currentUser={this.props.currentUser}
        fundingSource={f}
        optimisticallyRemoveFundingSource={() => {
          this.setState({ dataSource: this.EMPTY_DATA_SOURCE.cloneWithRows([]) });
          this.props.currentUser.update({ fundingSource: null });
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

  /**
    *   Returns a ready-to-render empty state view
  **/
  _getEmptyState() {
    return(
      <View style={{flex: 0.9, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.richBlack}}>
        <Text style={{fontSize: 18, color: colors.richBlack}}>No funding sources. Add one now!</Text>
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
              this._toggleModal();
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
          (this.state.empty) ? this._getEmptyState() : this._getFundingSourceList() }

        { /* Modal containing bank onboarding flow */ }
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={{ flex: 1.0, marginTop: 20 }}>
            <IAVWebView IAVToken={this.props.currentUser.IAVToken} firebaseToken={this.props.currentUser.token} />
          </View>
        </Modal>
      </View>
    );
  }
}

export default FundingSources;
