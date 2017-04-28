import React from 'react'
import moment from 'moment'
import {View, Text, TouchableHighlight, Animated, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {requestCast} from '../../helpers/lambda'
import {colors} from '../../globalStyles'
import {ProfilePic} from '../'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const styles = StyleSheet.create({
  successIconWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite,
    borderRadius: 4
  },
  buttonWrap: {
    backgroundColor: colors.snowWhite,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0
    }
  }
})

class MatchedUser extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      successIconWrap: {
        opacity: new Animated.Value(0)
      }
    }

    this.state = {
      pressable: true
    }

    this.ownsOrWants = (props.user.matchType === 'theyOwn') ? 'owns' : 'wants'
  }

  handlePress() {
    if (this.props.matchType === "theyOwn") {
      this.showSuccessIcon()

      requestCast({
        token: this.props.currentUser.token,
        matchedUser: this.props.user.uid,
        tag: this.props.castTitle
      })
    } else if (this.props.matchType === "youOwn" || this.props.matchType === "bothWant") {
      Actions.BroadcastOnboardingFlow({
        castTitle: this.props.castTitle,
        tag: this.props.tag
      })
    }
  }

  showSuccessIcon() {
    this.setState({pressable: false})

    Animated.timing(this.AV.successIconWrap.opacity, {
      toValue: 1,
      duration: 160
    }).start()
  }

  render() {
    return(
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 0, marginBottom: 3, marginLeft: 6, marginRight: 4}}>

        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={() => Actions.UserProfile({user: this.props.user})}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            { /* Profile Pic */ }
            <ProfilePic currentUser={this.props.user} size={38} />

            { /* Display Name */ }
            <View style={{paddingLeft: 8}}>
              <Text style={{color: colors.deepBlue, fontSize: 15, fontWeight: '400'}}>
                {`${this.props.user.firstName} ${this.props.user.lastName}`}
              </Text>
              <Text style={{color: colors.slateGrey, fontSize: 13, fontWeight: '400'}}>
                {`${this.props.user.firstName} ${this.ownsOrWants} this.`}
              </Text>
            </View>
          </View>
        </TouchableHighlight>

        { /* 'Create Cast' or 'Request Cast' button */ }
        <TouchableHighlight
          activeOpacity={(this.state.pressable) ? 0.75 : 1}
          underlayColor={'transparent'}
          onPress={() => (this.state.pressable) ? this.handlePress() : null}>
          <View style={styles.buttonWrap}>

            { /* Text */ }
            <Text style={{fontSize: 14, color: colors.accent}}>
              {(this.props.user.matchType === "theyOwn") ? "Request Cast" : "Create Cast"}
            </Text>

            { /* Success icon */ }
            <Animated.View style={[styles.successIconWrap, this.AV.successIconWrap]}>
              <EvilIcons name={"check"} size={28} color={colors.gradientGreen} />
            </Animated.View>

          </View>
        </TouchableHighlight>

      </View>
    )
  }
}

module.exports = MatchedUser
