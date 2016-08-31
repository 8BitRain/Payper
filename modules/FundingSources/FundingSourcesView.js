// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, ListView, RecyclerViewBackedScrollView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

// Helper functions
import * as Lambda from "../../services/Lambda";

// Custom stylesheets
import colors from "../../styles/colors";

// Partial components
import FundingSource from '../../components/FundingSource/FundingSource.js';

class FundingSources extends React.Component {
  constructor(props) {
    super(props);

    // Clone this for new data sources
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      empty: true,
      fundingSources: ds.cloneWithRows([
        {
          name: "Checking Account",
          bank: "UW Credit Union",
          accountNumber: "********3918",
          icon: "bank",
          active: false,
        },
        {
          name: "Savings Account",
          bank: "Chase",
          accountNumber: "********5792",
          icon: "bank",
          active: true,
        }
      ]),
    };

    Lambda.getFundingSource({ token: this.props.currentUser.token });
  }


  componentDidMount() {
    this._genRows();
  }


  // Generate rows for the list view
  _genRows() {
    if (!this.state.fundingSources || this.state.fundingSources.length == 0) return;

    // Set state, triggering re-rerender of list, then mark unseen notifications as seen
    this.setState({ empty: false });
  }


  //  Return a list of ready to render rows
  _renderRow(f) {
    return(
      <FundingSource currentUser={this.props.currentUser} fundingSource={f} />
    );
  }


  // Returns a ready-to-render notification ListView
  _getFundingSourceList() {
    return(
      <View style={{flex: 0.9, paddingTop: 0, backgroundColor: colors.richBlack}}>
        <ListView
          dataSource={this.state.fundingSources}
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
          onPress={() => console.log("Pressed 'Add a new bank account'")}>

          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: colors.richBlack, borderBottomWidth: 1.0, borderBottomColor: colors.accent}}>
            <Entypo name="plus" size={30} color={colors.accent} />
            <Text style={{fontFamily: 'Roboto', fontWeight: '100', fontSize: 16, paddingLeft: 10, color: colors.accent}}>
              Add a new bank acount
            </Text>
          </View>

        </TouchableHighlight>

        { /* Render list of notifications or empty state */  }
        {(this.state.empty) ? this._getEmptyState() : this._getFundingSourceList() }

      </View>
    );
  }
}

export default FundingSources;
