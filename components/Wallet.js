import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions, Alert} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'
import {withdrawFundsAlert} from '../helpers/alerts'
import {withdrawFunds} from '../helpers/lambda'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: colors.medGrey,
    width: dims.width * 0.9
  },
  shadow: {
    shadowColor: colors.slateGrey,
    shadowOpacity: 0.7,
    shadowRadius: 1,
    shadowOffset: {height: 0, width: 0}
  }
})

class Wallet extends React.Component {
  constructor(props) {
    super(props)
    this.withdrawFunds = this.withdrawFunds.bind(this)
  }

  withdrawFunds() {
    withdrawFundsAlert({
      amount: this.props.currentUser.balances.available,
      bankAccountName: this.props.currentUser.bankAccount.name,
      onConfirm: () => withdrawFunds({token: this.props.currentUser.token})
    })
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Title */ }
        <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '700', paddingBottom: 2}}>
          {"Payper Wallet"}
        </Text>

        { /* Total balance */ }
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20, color: colors.gradientGreen, alignSelf: 'flex-start', paddingTop: 4}}>
            {`$`}
          </Text>
          <Text style={{fontSize: 40, color: colors.gradientGreen}}>
            {this.props.currentUser.balances.total}
          </Text>

          { /* Available */
            (!this.props.currentUser.balances.available)
              ? null
              : <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 11, color: colors.gradientGreen, alignSelf: 'flex-start', paddingTop: 2}}>
                      {`$`}
                    </Text>
                    <Text style={{fontSize: 20, color: colors.gradientGreen}}>
                      {this.props.currentUser.balances.available}
                    </Text>
                  </View>
                  <Text style={{fontSize: 12, color: colors.deepBlue}}>
                    {"Available"}
                  </Text>
                </View> }

          { /* Pending */
            (!this.props.currentUser.balances.pending)
              ? null
              : <View style={{justifyContent: 'center', alignItems: 'center', marginLeft: 10}}>
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 11, color: colors.carminePink, alignSelf: 'flex-start', paddingTop: 2}}>
                      {`$`}
                    </Text>
                    <Text style={{fontSize: 20, color: colors.carminePink}}>
                      {this.props.currentUser.balances.pending}
                    </Text>
                  </View>
                  <Text style={{fontSize: 12, color: colors.deepBlue}}>
                    {"Pending"}
                  </Text>
                </View> }
        </View>

        { /* Cash out button/link bank account button */
          (this.props.currentUser.bankAccount && this.props.currentUser.balances.available && parseFloat(this.props.currentUser.balances.available) > 0)
          ? <View style={[styles.shadow, {borderRadius: 4, marginTop: 6}]}>
              <TouchableHighlight
                activeOpacity={0.75}
                underlayColor={colors.lightGrey}
                onPress={this.withdrawFunds}>
                <View style={{width: dims.width * 0.72, height: 40, borderRadius: 4, flexDirection: 'row', backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 16, fontWeight: '400', color: colors.snowWhite}}>
                    {"Transfer to Bank"}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          : (!this.props.currentUser.bankAccount)
            ? <View style={[styles.shadow, {borderRadius: 4, marginTop: 6}]}>
                <TouchableHighlight
                  activeOpacity={0.75}
                  underlayColor={colors.lightGrey}
                  onPress={() => Alert.alert(
                    "Bank Account",
                    "Add a bank account to withdraw funds from your Payper wallet.",
                    [
                      {text: 'Cancel', onPress: () => null},
                      {text: 'Add Bank', onPress: () => Actions.BankAccounts()}
                    ]
                  )}>
                  <View style={{width: dims.width * 0.72, height: 40, borderRadius: 4, flexDirection: 'row', backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, fontWeight: '400', color: colors.snowWhite}}>
                      {"Add Bank Account"}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            : null }

      </View>
    )
  }
}

module.exports = Wallet
