import React from 'react'
import {View, Text, StyleSheet, TouchableHighlight, Animated, Platform, Dimensions, StatusBar} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'
import {Secret} from './Broadcasts'
import {Loader} from './'
import Button from 'react-native-button'
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
  textWrap: {
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  shadow: {
    shadowColor: colors.slateGrey,
    shadowOpacity: 0.7,
    shadowRadius: 1,
    shadowOffset: {height: 0, width: 0}
  },
  viewSecretButton: {
    padding: 14,
    borderRadius: 5,
    backgroundColor: colors.gradientGreen,
    justifyContent: 'center',
    alignItems: 'center',
    width: dims.width * 0.7
  },
  loaderWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  }
})

class OnSubscribeModal extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      textWrap: {
        opacity: new Animated.Value(0),
        height: new Animated.Value(0)
      },
      viewSecretButton: {
        opacity: new Animated.Value(1),
        height: new Animated.Value(120)
      },
      secretWrap: {
        opacity: new Animated.Value(0)
      },
      loaderWrap: {
        opacity: new Animated.Value((true === props.loading) ? 1 : 0)
      }
    }

    this.state = {
      canPressBack: true,
      secret: null
    }

    this.back = this.back.bind(this)
    this.hideViewSecretButton = this.hideViewSecretButton.bind(this)
    this.showSecret = this.showSecret.bind(this)
    this.showText = this.showText.bind(this)
  }

  componentDidMount() {
    if (!this.props.loading) setTimeout(this.showText, 800)
  }

  componentWillReceiveProps(nextProps) {
    if (true === this.props.loading && false === nextProps.loading)
      this.hideLoader(() => this.showText())
  }

  back() {
    if (!this.state.canPressBack) return
    this.setState({canPressBack: false})
    this.props.onBack()
  }

  hideLoader(cb) {
    Animated.timing(this.AV.loaderWrap.opacity, {
      toValue: 0,
      duration: 250
    }).start(() => (typeof cb === 'function') ? cb() : null)
  }

  hideViewSecretButton() {
    let animations = [
      Animated.timing(this.AV.viewSecretButton.height, {
        toValue: 0,
        duration: 170
      }),
      Animated.timing(this.AV.viewSecretButton.opacity, {
        toValue: 0,
        duration: 120
      })
    ]

    Animated.parallel(animations).start(this.showSecret)
  }

  showSecret() {
    Animated.timing(this.AV.secretWrap.opacity, {
      toValue: 1,
      duration: 120
    }).start()
  }

  showText() {
    let animations = [
      Animated.timing(this.AV.textWrap.height, {
        toValue: 175,
        duration: 170
      }),
      Animated.timing(this.AV.textWrap.opacity, {
        toValue: 1,
        duration: 120
      })
    ]

    Animated.parallel(animations).start()
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"default"} />

        { /* Header */ }
        <View style={{position: 'absolute', top: 0, right: 0, left: 0, padding: 10, paddingTop: (Platform.OS === 'ios') ? 24 : 10, borderBottomWidth: 1, borderColor: colors.medGrey}}>
          <TouchableHighlight activeOpacity={0.75} underlayColor={'transparent'} onPress={this.back}>
            <EvilIcons name={"chevron-left"} size={50} color={colors.accent} />
          </TouchableHighlight>
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>

          { /* Check mark */ }
          <EvilIcons name={"check"} size={100} color={colors.accent} />

          { /* Success message */ }
          <Text style={{padding: 10, width: dims.width * 0.8, fontSize: 22, color: colors.deepBlue, textAlign: 'center'}}>
            {`You've subscribed to ${this.props.broadcast.title}!`}
          </Text>

        </View>

        { /* Animated content */ }
        <Animated.View style={[styles.textWrap, this.AV.textWrap]}>

          { /* View secret button */ }
          <Animated.View style={[{justifyContent: 'center', alignItems: 'center'}, this.AV.viewSecretButton]}>
            <EvilIcons name={(this.state.secret) ? "unlock" : "lock"} size={40} color={(this.state.secret) ? colors.gradientGreen : colors.slateGrey} />

            <View style={{height: 6}} />

            <TouchableHighlight activeOpacity={0.75} underlayColor={'transparent'} onPress={this.hideViewSecretButton}>
              <Animated.View style={[styles.viewSecretButton, styles.shadow]}>
                <Text style={{fontSize: 18, color: colors.snowWhite}}>
                  {`View Secret`}
                </Text>
              </Animated.View>
            </TouchableHighlight>
          </Animated.View>

          { /* Secret */ }
          <Animated.View style={[this.AV.secretWrap]}>
            <Secret
              shouldDecrypt={false}
              decryptedSecret={this.props.decryptedSecret}
              width={dims.width * 0.88}
              broadcast={this.props.broadcast}
              currentUser={this.props.currentUser}
              showBorder={false} />
          </Animated.View>

        </Animated.View>

        { /* Loader */ }
        <Animated.View style={[styles.loaderWrap, this.AV.loaderWrap]}>
          <Loader />
        </Animated.View>
      </View>
    )
  }
}

module.exports = OnSubscribeModal
