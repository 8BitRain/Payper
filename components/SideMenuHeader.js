import React from 'react'
import {View, TouchableHighlight, Image, StyleSheet, Dimensions, Text, Platform, Animated, Easing} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'
import {ProfilePic} from './'
import {getProfileStrength} from '../helpers/utils'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: dims.width * 0.725,
    padding: 14,
    paddingTop: (Platform.OS === 'ios') ? 24 : 10
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: dims.width * 0.725
  },
  profilePicWrap: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 0.65,
    paddingLeft: 12
  },
  iconWrap: {
    flex: 0.15
  },
  progressBarWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: dims.width * 0.725,
    backgroundColor: 'red'
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.gradientGreen
  }
})

class SideMenuHeader extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      progressBar: {
        width: new Animated.Value(0)
      }
    }

    this.state = {
      profileStrength: (props.currentUser.appFlags) ? getProfileStrength(props.currentUser.appFlags) : 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser.appFlags) {
      let profileStrength = getProfileStrength(nextProps.currentUser.appFlags)
      this.animateProgressBar(profileStrength)
      this.setState({profileStrength})
    }
  }

  animateProgressBar(profileStrength) {
    let newWidth = (profileStrength / 100) * (dims.width * 0.725)

    Animated.timing(this.AV.progressBar.width, {
      toValue: newWidth,
      duration: 200
    }).start()
  }

  render() {
    return(
      <TouchableHighlight activeOpacity={0.75} underlayColor={'transparent'} onPress={Actions.MyProfile}>
        <View>

          { /* Background gradient */ }
          <Image source={require('../assets/images/accent-to-white.png')} style={styles.backgroundImage} />

          { /* Inner content */ }
          <View style={styles.container}>

            { /* Profile Pic */ }
            <View style={styles.profilePicWrap}>
              <ProfilePic size={42} currentUser={this.props.currentUser} />
            </View>

            { /* Text */ }
            <View style={styles.textWrap}>
              <Text style={{fontSize: 17, color: colors.deepBlue, fontWeight: '500'}}>
                {`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}
              </Text>
              <Text style={{fontSize: 13, color: colors.deepBlue}}>
                {`$${(this.props.currentUser.balances) ? this.props.currentUser.balances.total : 0} in Payper Wallet`}
              </Text>
            </View>

            { /* Icons */ }
            <View style={styles.iconWrap}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <EvilIcons name={"chevron-right"} size={22} color={colors.deepBlue} />
              </View>
            </View>

          </View>

          { /* Profile completion bar
          <View stye={styles.progressBarWrap}>
            <Animated.View style={[styles.progressBar, this.AV.progressBar]} />
            <Text style={{fontSize: 17, color: colors.deepBlue, padding: 7}}>
              {`Profile Strength: ${this.state.profileStrength}%`}
            </Text>
          </View>
          */ }

        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = SideMenuHeader
