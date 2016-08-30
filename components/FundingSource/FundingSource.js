// Dependencies
import React from 'react';
import { View, TouchableHighlight, Text, StyleSheet, ActionSheetIOS } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Actions } from 'react-native-router-flux';

// Helpers
import * as Lambda from '../../services/Lambda';

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
    padding: 5,
  },

  // Informational text
  text: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.white,
    padding: 5,
  },

  // Menu icon wrap
  dots: {
    position: 'absolute',
    top: 22.5,
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

    this.actionSheetOptions = ['Set as Active Bank Account', 'Edit Bank Account', 'Delete Bank Account', 'Nevermind'];
  }

  _handleMenuPress() {
    console.log("Pressed menu");

    ActionSheetIOS.showActionSheetWithOptions({
      options: this.actionSheetOptions,
      cancelButtonIndex: 3
    },
    (buttonIndex) => {
      console.log(this.actionSheetOptions[buttonIndex]);
    });
  }

  render() {
    return(
      <TouchableHighlight
        onPress={() => this._handleMenuPress()}
        underlayColor={'transparent'}
        activeOpacity={0.7}
        style={{borderTopWidth: 1.0, borderTopColor: colors.accent}}>

        <View style={styles.wrap}>

          { /* Name */
            (this.props.fundingSource.active)
              ? <Text style={styles.name}>
                  <Text>
                    { this.props.fundingSource.name }
                    { " " }
                    <Entypo name="star" size={18} color={colors.alertYellow} />
                    { " " }
                  </Text>
                  <Text style={[styles.text, {color: colors.alertYellow, fontWeight: '400'}]}>
                    (Active)
                  </Text>
                </Text>
              : <Text style={styles.name}>{ this.props.fundingSource.name }</Text>
          }

          { /* Bank Name */ }
          <Text style={styles.text}>
            { this.props.fundingSource.bank }
          </Text>

          { /* Account number (hidden) */ }
          <Text style={styles.text}>
            Account Number: { this.props.fundingSource.accountNumber }
          </Text>

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
