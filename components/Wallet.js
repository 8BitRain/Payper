import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native'
import {colors} from '../globalStyles'
import Entypo from 'react-native-vector-icons/Entypo'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.gradientGreen,
    padding: 12
  }
})

class Wallet extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={styles.container}>

        { /* Wallet Icon */ }
        <View style={{flex: 0.3}}>
          <Entypo name={"wallet"} size={30} color={colors.snowWhite} />
        </View>

        { /* Text */ }
        <View style={{flex: 0.7}}>
          <Text>
            {"$30.00 in Payper"}
          </Text>
          <Text>
            {"> Transfer to Bank"}
          </Text>
        </View>

      </View>
    )
  }
}

module.exports = Wallet
