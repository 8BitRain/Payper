import React from 'react'
import {View, TouchableHighlight, Text, StyleSheet, StatusBar, Platform, Dimensions} from 'react-native'
import {colors} from '../globalStyles'

const dims = Dimensions.get('window')
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
  },
  indicatorWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: dims.width * 0.33,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, borderColor: 'red'
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.snowWhite,
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
              onPress={() => this.props.changeTab(tabName)}
              style={[styles.tabWrap, {borderColor: (this.props.activeTab === tabName) ? colors.lightGrey : colors.accent}]}>
              <View>
                <Text style={styles.tabText}>{tabName}</Text>
                { /*
                <View style={styles.indicatorWrap}>
                  <View style={styles.indicator} />
                </View>
                */ }
              </View>
            </TouchableHighlight>
          )
        })}
      </View>
    )
  }
}

module.exports = TabBar
