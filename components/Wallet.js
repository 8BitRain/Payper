import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions} from 'react-native'
import {colors} from '../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: colors.lightGrey,
    borderBottomWidth: 1,
    borderColor: colors.medGrey
  },
  shadow: {
    shadowColor: colors.slateGrey,
    shadowOpacity: 0.7,
    shadowRadius: 1,
    shadowOffset: {height: 0, width: 0}
  }
})

class Wallet extends React.Component {
  render() {
    return (
      <View style={styles.container}>

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

        { /* Spacer */ }
        <View style={{height: 10}} />

        { /* Cash out button */ }
        <View style={[styles.shadow, {borderRadius: 4}]}>
          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={colors.lightGrey}
            onPress={() => alert("Transfer to Bank")}>
            <View style={{width: dims.width * 0.72, height: 40, borderRadius: 4, flexDirection: 'row', backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 16, fontWeight: '400', color: colors.snowWhite}}>
                {"Transfer to Bank"}
              </Text>
            </View>
          </TouchableHighlight>
        </View>

      </View>
    )
  }
}

module.exports = Wallet
