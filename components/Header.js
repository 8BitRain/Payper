import React from 'react'
import {View, TouchableHighlight, Text, StyleSheet, StatusBar, Platform, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'
import {TabBar} from './'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accent,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: dims.width
  },
  // sideMenuButtonWrap: {
  //   paddingTop: 5,
  //   paddingLeft: 8,
  //   paddingRight: 50,
  //   paddingBottom: 0
  // },
  sideMenuButtonWrap: {
    padding: 8,
    paddingTop: 5
  },
  backButtonWrap: {
    padding: 6,
  },
  dotsWrap: {
    padding: 6,
    paddingRight: 18
  },
  skipWrap: {
    padding: 6,
    paddingRight: 18
  },
  titleWrap: {
    position: 'absolute',
    top: (Platform.OS === 'ios') ? 20 : 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    color: colors.snowWhite
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
        <StatusBar barStyle={"light-content"} />

        {this.props.title && this.props.showTitle
          ? <View style={styles.titleWrap}>
              <Text style={styles.title}>{this.props.title}</Text>
            </View>
          : null }

        <View style={styles.navWrap}>
          {this.props.showBackButton
            ? <TouchableHighlight
                activeOpacity={0.75}
                underlayColor={'transparent'}
                onPress={this.props.onBack || Actions.pop}
                style={styles.backButtonWrap}>
                <EvilIcons name={"chevron-left"} size={42} color={colors.snowWhite} />
              </TouchableHighlight>
            : null}

          {this.props.showSideMenuButton
            ? <TouchableHighlight
                activeOpacity={0.75}
                underlayColor={'transparent'}
                onPress={this.toggleSideMenu}
                style={styles.sideMenuButtonWrap}>
                <EvilIcons name={"navicon"} size={32} color={colors.snowWhite} />
              </TouchableHighlight>
            : null}

          {this.props.showDots
            ? <TouchableHighlight
                activeOpacity={0.75}
                underlayColor={'transparent'}
                onPress={this.props.onDotsPress || null}
                style={styles.dotsWrap}>
                <Entypo name={"dots-three-horizontal"} size={28} color={colors.snowWhite} />
              </TouchableHighlight>
            : null}
        </View>

        { /* Skip button */
          this.props.showSkip
          ? <View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 5, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <TouchableHighlight
                activeOpacity={0.75}
                underlayColor={'transparent'}
                onPress={this.props.onSkip || null}
                style={styles.skipWrap}>
                <Text style={{fontSize: 16, color: colors.snowWhite}}>{"Skip"}</Text>
              </TouchableHighlight>
            </View>
          : null}

        {this.props.showTabBar
          ? <TabBar {...this.props} />
          : null}
      </View>
    )
  }
}

module.exports = Header
