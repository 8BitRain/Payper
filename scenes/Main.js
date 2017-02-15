import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native'
import Button from 'react-native-button'
import {Actions} from 'react-native-router-flux'
import {Header} from '../components'
import {colors} from '../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  newBroadcastButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 20
  }
})

class Main extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Header {...this.props} showTabBar={true} />

        <View style={styles.container}>
          <Text>{`Active tab: ${this.props.title}`}</Text>
        </View>

        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={Actions.NewBroadcast}>
          <View style={styles.newBroadcastButton}>
            <EvilIcons name={"plus"} color={colors.accent} size={48} />
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

module.exports = Main
