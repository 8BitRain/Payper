import React from 'react'
import {View, Text, StyleSheet, Dimensions, TextInput, Keyboard, TouchableHighlight, Alert, Image, Animated} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {ContinueButton} from '../../components'
import {colors} from '../../globalStyles'
import {FBLoginManager} from 'NativeModules'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.snowWhite,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: dims.width
  },
  logo: {
    width: dims.width * 0.23,
    height: dims.width * 0.23,
    borderRadius: 6
  },
  buttonWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    paddingLeft: 14,
    borderRadius: 5,
    backgroundColor: colors.snowWhite,
    shadowColor: colors.lightGrey,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500'
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.snowWhite,
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  taglineText: {
    fontSize: 24,
    fontWeight: '400',
    color: colors.snowWhite,
    textAlign: 'center',
    backgroundColor: 'transparent'
  }
})

class PromoLander extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      logo: {opacity: new Animated.Value(0)},
      welcome: {opacity: new Animated.Value(0)},
      tagline: {opacity: new Animated.Value(0)},
      continueButton: {opacity: new Animated.Value(0)}
    }

    this.fadeIn = this.fadeIn.bind(this)
  }

  componentDidMount() {
    FBLoginManager.logOut()
    setTimeout(this.fadeIn, 400)
  }

  fadeIn() {
    let animations = [
      Animated.timing(this.AV.logo.opacity, {
        toValue: 1,
        duration: 320
      }),
      Animated.timing(this.AV.welcome.opacity, {
        toValue: 1,
        duration: 380
      }),
      Animated.timing(this.AV.tagline.opacity, {
        toValue: 1,
        duration: 400
      }),
      Animated.timing(this.AV.continueButton.opacity, {
        toValue: 1,
        duration: 500
      })
    ]

    Animated.sequence(animations).start()
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Background image */ }
        <Image source={require('../../assets/images/lander-background.jpg')} style={styles.backgroundImage} />

        <View style={{flex: 0.85, width: dims.width * 0.85, alignItems: 'center', justifyContent: 'center'}}>

          { /* Logo */ }
          <Animated.View style={this.AV.logo}>
            <Image source={require('../../assets/images/app-icon.png')} style={styles.logo} />
          </Animated.View>

          { /* Spacer */ }
          <View style={{height: 28}} />

          { /* Welcome */ }
          <Animated.View style={this.AV.welcome}>
            <Text style={styles.welcomeText}>
              {"Welcome to Payper"}
            </Text>
          </Animated.View>

          { /* Spacer */ }
          <View style={{height: 10}} />

          { /* Tagline */ }
          <Animated.View style={this.AV.tagline}>
            <Text style={styles.taglineText}>
              {"Subscriptions made social."}
            </Text>
          </Animated.View>
        </View>

        { /* Submit button */ }
        <View style={{flex: 0.15, justifyContent: 'center', alignItems: 'center', paddingBottom: 20}}>
          <Animated.View style={this.AV.continueButton}>
            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={Actions.PromoWants}>
              <View style={styles.buttonWrap}>
                <Text style={styles.buttonText}>
                  {"Pick a Free Subscription"}
                </Text>
                <View style={{paddingTop: 2}}>
                  <EvilIcons name={"chevron-right"} size={34} color={colors.accent} />
                </View>
              </View>
            </TouchableHighlight>
          </Animated.View>
        </View>
      </View>
    )
  }
}

module.exports = PromoLander
