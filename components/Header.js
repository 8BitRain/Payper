import React from 'react'
import {View, TouchableHighlight, Text, StyleSheet, StatusBar, Platform, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'
import {TabBar} from './'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accent,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    shadowColor: colors.slateGrey,
    shadowOpacity: 1.0,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  navWrap: {
    width: dims.width,
    paddingLeft: 8,
    paddingTop: 5
  }
})

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.toggleSideMenu = this.toggleSideMenu.bind(this)
  }

  toggleSideMenu() {
    Actions.refresh({key: 'Main', open: value => !value})
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navWrap}>
          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={'transparent'}
            onPress={this.toggleSideMenu}>
            <EvilIcons name={"navicon"} size={36} color={colors.snowWhite} />
          </TouchableHighlight>
        </View>
        {this.props.showTabBar ? <TabBar {...this.props} /> : null}
      </View>
    )
  }
}

module.exports = Header
