import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { PaymentCard } from './'
import colors from '../styles/colors'
const dims = Dimensions.get('window')

class Lander extends React.Component {
  super(props) {
    constructor(props)
  }

  render() {
    return(
      <View style={styles.wrap}>
        <PaymentCard />
      </View>
    )
  }
}

const styles = {
  wrap: {
    backgroundColor: colors.deepBlue,
    marginTop: 40,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
}

module.exports = Lander
