// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, ListView, RecyclerViewBackedScrollView, Modal, StatusBar } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Entypo from 'react-native-vector-icons/Entypo';

// Helper functions
import * as Alert from "../../helpers/Alert";
import * as Lambda from "../../services/Lambda";
import * as Init from '../../_init';

// Custom stylesheets
import colors from "../../styles/colors";

// Partial components
import FundingSource from '../../components/FundingSource/FundingSource.js';
import BankOnboarding from '../../modules/BankOnboarding/BankOnboardingContainer';

class FundingSources extends React.Component {
  constructor(props) {
    super(props);

    this.EMPTY_DATA_SOURCE = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      empty: true,
      fundingSources: this.props.fundingSourcesDataSource,
      modalVisible: false,
    };
  }

  componentDidMount() {
    this._genRows();
  }

  _toggleModal(options) {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  _verifyOnboardingStatus() {
    if (this.props.flags.onboarding_state == 'customer') {
      this.props.setNewUserToken(this.props.currentUser.token);
    } else if (this.state.fundingSources.getRowCount() == 0) {
      // Extend scope
      const _this = this;

      this.props.setNewUserToken(this.props.currentUser.token);
      var data = { token: this.props.currentUser.token };

      // Initiate IAV
      Init.getIavToken(data, function(iavTokenRecieved, iavToken) {
        if (iavTokenRecieved) {
          _this.props.setIav(iavToken.token);
        }
      });
    }
  }

  // Generate rows for the list view
  _genRows() {
    if (!this.props.fundingSourcesDataSource || this.props.fundingSourcesArray.length == 0) return;
    this.setState({ empty: false });
  }


  //  Return a list of ready to render rows
  _renderRow(f) {
    return(
      <FundingSource
        currentUser={this.props.currentUser}
        fundingSource={f}
        optimisticallyRemoveFundingSource={() => this.props.setFundingSources([])} />
    );
  }


  // Returns a ready-to-render notification ListView
  _getFundingSourceList() {
    console.log("Data source:", this.props.fundingSourcesDataSource);
    return(
      <View style={{flex: 0.9, paddingTop: 0, backgroundColor: colors.richBlack}}>
        <ListView
          dataSource={this.props.fundingSourcesDataSource}
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
            if (this.props.fundingSourcesArray.length > 0) {
              Alert.message({
                title: "Unfortunately...",
                message: "Payper doesn't currently support multiple bank accounts. This feature will be available soon!",
              });
            } else {
              this._verifyOnboardingStatus();
              if (this.props.flags.onboarding_state != "complete" || this.state.fundingSources.getRowCount() == 0) this._toggleModal();
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
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={ () => alert("Closed modal") }>

          { /* Lighten status bar text */ }
          <StatusBar barStyle="light-content" />

          <View style={{flex: 1.0}}>
            <BankOnboarding
              {...this.props}
              toggleModal={(options) => this._toggleModal(options)} />
          </View>

        </Modal>
      </View>
    );
  }
}

export default FundingSources;
