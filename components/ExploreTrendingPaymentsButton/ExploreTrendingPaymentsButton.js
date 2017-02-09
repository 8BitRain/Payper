import React from 'react'
import {View, TouchableHighlight, Dimensions, Text} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../../globalStyles'
import {TrendingPayments} from '../'

const dims = Dimensions.get('window')

class ExploreTrendingPaymentsButton extends React.Component {
  render() {
    return(
      <View style={{
        width: dims.width * 0.94,
        marginLeft: dims.width * 0.03,
        marginTop: 10,
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        shadowColor: colors.medGrey,
        shadowOpacity: 1.0,
        shadowRadius: 1,
        shadowOffset: {
          height: 0.25,
          width: 0.25
        }
      }}>
        { /* Top half (info) */ }
        <View style={{
          flex: 1.0, justifyContent: 'center', alignItems: 'center',
          paddingTop: 16, paddingBottom: 16,
          paddingLeft: 5, paddingRight: 5,
          backgroundColor: colors.snowWhite
        }}>
          <Text style={{fontSize: 16, color: colors.deepBlue, textAlign: 'center'}}>
            {"Curious what others are using Payper for?"}
          </Text>
        </View>

        { /* Bottom half (action) */ }
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => Actions.GlobalModal({
            subcomponent: <TrendingPayments />,
            showHeader: true,
            title: "Trending Payments"
          })}>
          <View style={{
            flex: 1.0, justifyContent: 'center', alignItems: 'center',
            padding: 12, backgroundColor: colors.accent
          }}>
            <Text style={{fontSize: 18, color: colors.snowWhite, textAlign: 'center'}}>
              {"Explore Trending Payments"}
            </Text>
          </View>
        </TouchableHighlight>

        { /* Info
        <View style={{flex: 1.0, padding: 8, backgroundColor: 'red'}}>
          <Text>
            {"Curious what others are using Payper for?"}
          </Text>
        </View>
        */ }

        { /* Action
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={'transparent'}
          onPress={() => Actions.GlobalModal({
            subcomponent: <View />, // TODO
            showHeader: true,
            title: "Trending Payments"
          })}>
          <View style={{flex: 1.0, padding: 8, backgroundColor: 'blue'}}>
            <Text>
              {"Explore Trending Payments"}
            </Text>
          </View>
        </TouchableHighlight>
        */ }
      </View>
    )
  }
}

module.exports = ExploreTrendingPaymentsButton
