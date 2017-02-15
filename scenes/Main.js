import React from 'react'
import {View, Text, StyleSheet} from "react-native"
import Button from "react-native-button"
import {Actions} from "react-native-router-flux"
import {Header} from '../components'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
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
      </View>
    )
  }
}

module.exports = Main
