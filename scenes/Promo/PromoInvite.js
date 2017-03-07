import React from 'react'
import {View, Text, StyleSheet, Dimensions, TextInput, Keyboard, TouchableHighlight, Alert, Image, Animated, Easing, Modal} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {ContinueButton, HowItWorksCarousel, Header, Invite} from '../../components'
import {colors} from '../../globalStyles'
import {FBLoginManager} from 'NativeModules'
import Carousel from 'react-native-carousel'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.snowWhite,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snowWhite
  },
  subscriptionLogo: {
    width: dims.width * 0.3,
    height: dims.width * 0.3,
    borderRadius: (dims.width * 0.3) / 2,
    borderWidth: 3,
    borderColor: colors.lightGrey
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: dims.width
  },
  logoWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 5,
    marginTop: 8,
    shadowColor: colors.medGrey,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  modalWrap: {
    flex: 1,
    backgroundColor: colors.snowWhite
  }
})

class PromoInvite extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modalIsVisible: false
    }

    this.AV = {
      logoWrap: {paddingBottom: new Animated.Value(0)},
      textWrap: {opacity: new Animated.Value(0)}
    }
  }

  componentDidMount() {
    let animations = [
      Animated.spring(this.AV.logoWrap.paddingBottom, {
        toValue: dims.height * 0.65,
        duration: 200
      }),
      Animated.spring(this.AV.textWrap.opacity, {
        toValue: 1,
        duration: 150
      })
    ]

    setTimeout(() => Animated.parallel(animations).start(), 400)
  }

  render() {
    return (
      <View style={styles.container}>

        { /* Background image */ }
        <Image source={require('../../assets/images/lander-background.jpg')} style={styles.backgroundImage} />

        { /* Subscription Logo */ }
        <Animated.View style={[styles.logoWrap, this.AV.logoWrap]}>
          <Image
            style={styles.subscriptionLogo}
            source={require('../../assets/images/logos/netflix.png')} />
        </Animated.View>

        { /* Text and buttons */ }
        <Animated.View style={[{paddingTop: 40}, this.AV.textWrap]}>
          <View style={{width: dims.width, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', borderTopRightRadius: 6, borderTopLeftRadius: 6, paddingLeft: 14, paddingTop: 10, paddingBottom: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)', width: dims.width * 0.85}}>
              <EvilIcons name={"question"} size={28} color={colors.deepBlue} />
              <Text style={{fontSize: 18, fontWeight: '400', paddingLeft: 10}}>
                {"Now What?"}
              </Text>
            </View>

            <View style={{padding: 12, paddingBottom: 0, backgroundColor: colors.lightGrey, width: dims.width * 0.85}}>
              <Text style={{fontSize: 15, fontWeight: '300'}}>
                {`We'll set up your ${/*this.props.subscription.name*/'Netflix'} subscription and notify you when Payper launches. Would you like to join with friends or other users from SXSW?`}
              </Text>
            </View>

            <View style={{borderBottomRightRadius: 6, borderBottomLeftRadius: 6, padding: 12, backgroundColor: colors.lightGrey, width: dims.width * 0.85}}>
              <TouchableHighlight
                onPress={() => this.setState({modalIsVisible: true})}
                underlayColor={'transparent'}>
                <View style={[styles.button, {backgroundColor: colors.accent}]}>
                  <Text style={{fontSize: 15, fontWeight: '500', color: colors.snowWhite}}>
                    {"Invite Friends"}
                  </Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => alert("Join w/ SXSW Users")}
                underlayColor={'transparent'}>
                <View style={[styles.button, {backgroundColor: colors.gradientGreen}]}>
                  <Text style={{fontSize: 15, fontWeight: '500', color: colors.snowWhite}}>
                    {"Join with SXSW Users"}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </Animated.View>

        <Modal animationType={'slide'} visible={this.state.modalIsVisible}>
          <View style={styles.modalWrap}>
            <Header
              showTitle
              showBackButton
              title={"Invite Contacts"}
              onBack={() => this.setState({modalIsVisible: false})} />
            <Invite
              induceState={(substate) => this.setState(substate, () => console.log(this.state))}
              closeModal={() => this.setState({modalIsVisible: false})} />
          </View>
        </Modal>

      </View>
    )
  }
}

module.exports = PromoInvite
