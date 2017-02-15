import React from 'react'
import {View, TouchableHighlight, Text, StyleSheet, StatusBar, Platform} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabWrap: {
    flex: 0.33,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    paddingTop: 7,
    paddingBottom: 10
  },
  tabText: {
    color: colors.snowWhite,
    fontSize: 16
  }
})

class TabBar extends React.Component {
  constructor(props) {
    super(props)

    this.config = {
      tabs: ["Broadcasts", "Explore", "Me"]
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.config.tabs.map((tabName, i) => {
          return(
            <TouchableHighlight
              key={tabName}
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={(this.props.title === tabName) ? null : Actions[tabName]}
              style={[styles.tabWrap, {borderColor: (this.props.title === tabName) ? colors.lightGrey : colors.accent}]}>
              <Text style={styles.tabText}>{tabName}</Text>
            </TouchableHighlight>
          )
        })}
      </View>
    )
  }
}

module.exports = TabBar
