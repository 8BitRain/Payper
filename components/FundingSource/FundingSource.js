// Dependencies
import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, ActionSheetIOS } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Actions } from 'react-native-router-flux';

// Helpers
import * as Lambda from '../../services/Lambda';
import * as Alert from '../../helpers/Alert';

// Stylesheets
import colors from '../../styles/colors';
const styles = StyleSheet.create({

  // Row wrap
  wrap: {
    flex: 1.0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: colors.richBlack,
    padding: 15,
  },

  // Bank account name text
  name: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: colors.accent,
    fontWeight: '100',
    padding: 1.5,
  },

  // Informational text
  text: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.white,
    padding: 1.5,
  },

  // Menu icon wrap
  dots: {
    position: 'absolute',
    top: 20,
    right: 22.5,
    width: 50,
    height: 50,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

});


class FundingSource extends React.Component {
  constructor(props) {
    super(props);
    // this.actionSheetOptions = ['Set Active', 'Edit', 'Delete', 'Nevermind'];
    this.actionSheetOptions = ['Delete', 'Nevermind'];
  }

  _handleMenuPress() {
    ActionSheetIOS.showActionSheetWithOptions({
      title: this.props.fundingSource.name,
      options: this.actionSheetOptions,
      cancelButtonIndex: 3
    },
    (buttonIndex) => {
      if (this.actionSheetOptions[buttonIndex] == "Delete") {

        // Extend scope
        const _this = this;

        // Confirm deletion
        Alert.confirmation({
          title: "Are you sure you'd like to remove this funding source?",
          message: "You can always add it back later.",
          cancelMessage: "Nevermind",
          confirmMessage: "Yes",
          cancel: () => {
            console.log("Nevermind");
          },
          confirm: () => {
            console.log("Removing funding source...");
            _this.props.optimisticallyRemoveFundingSource();
            Lambda.removeFundingSource({ token: _this.props.currentUser.token }, (success) => {
              if (success) console.log("Success!");
              else console.log("Failure :(")
            });
          },
        });
      }
    });
  }

  render() {
    return(
      <TouchableHighlight
        onPress={() => this._handleMenuPress()}
        underlayColor={'transparent'}
        activeOpacity={0.7}
        style={{borderBottomWidth: 1.0, borderBottomColor: colors.accent}}>

        <View style={styles.wrap}>

          { /* Account name */ }
          <Text style={styles.name}>{ this.props.fundingSource.name }</Text>

          { /* Is this the currently active bank account? */
            (this.props.fundingSource.active)
              ? <Text style={[styles.text, {color: colors.alertYellow, fontWeight: '400'}]}>
                  <Entypo name="star" size={18} color={colors.alertYellow} />
                  { " (Active)" }
                </Text>
              : null }

          { /* Bank Name
          <Text style={styles.text}>
            Bank: { this.props.fundingSource.bank }
          </Text>
          */ }

          { /* Account number (hidden)
          <Text style={styles.text}>
            Account Number: { this.props.fundingSource.accountNumber }
          </Text>
           */ }

          { /* Menu icon */ }
          <TouchableHighlight
            activeOpacity={0.7}
            underlayColor={'transparent'}
            onPress={() => this._handleMenuPress()}
            style={styles.dots}>

            <Entypo style={styles.iconSettings} name="dots-three-horizontal" size={20} color={colors.accent}/>

          </TouchableHighlight>
        </View>
      </TouchableHighlight>
    );
  }
}

export default FundingSource;
