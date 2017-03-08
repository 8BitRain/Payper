import React from 'react'
import firebase from 'firebase'
import {View, Text, StyleSheet, Dimensions, TextInput, Keyboard, TouchableHighlight, Alert, Image, Animated, Easing, Modal, UIManager, findNodeHandle} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {ContinueButton, HowItWorksCarousel, Header, Invite} from '../../components'
import {colors} from '../../globalStyles'
import {FBLoginManager} from 'NativeModules'
import DeviceInfo from 'react-native-device-info'
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
      modalIsVisible: false,
      buttonsVisible: true
    }

    this.AV = {
      logoWrap: {
        paddingBottom: new Animated.Value(0)
      },
      successIndicator: {
        right: new Animated.Value(dims.width)
      },
      textWrap: {
        opacity: new Animated.Value(0)
      },
      buttons: {
        marginTop: new Animated.Value(0),
        opacity: new Animated.Value(1)
      },
      header: {
        borderBottomLeftRadius: new Animated.Value(0),
        borderBottomRightRadius: new Animated.Value(0)
      }
    }
  }

  componentDidMount() {
    setTimeout(() => this.positionLogo(), 400)
  }

  submit() {
    // Hide buttons/reposition logo
    this.hideButtons(() => {
      this.positionLogo(() => this.setState({buttonsVisible: false}))
    })

    // Extract invitees' phone numbers
    let invitees = ""
    if (this.state.selectedNums) {
      for (var i in this.state.selectedNums) {
        let curr = this.state.selectedNums[i]
        let num = curr.split(":")[0]
        if (invitees === "") invitees = invitees.concat(num)
        else invitees = invitees.concat(",".concat(num))
      }
    }

    // Persist to Firebase
    for (var i in this.props.userData) if (!this.props.userData[i]) this.props.userData[i] = ""
    let firebaseData = Object.assign({}, this.props.userData,
      {
        invitedNumbers: invitees,
        device: {
          id: DeviceInfo.getUniqueID(),
          manufacturer: DeviceInfo.getManufacturer(),
          brand: DeviceInfo.getBrand(),
          model: DeviceInfo.getModel()
        }
      })
    firebase.database().ref('/SXSW/users').push(firebaseData)
  }

  hideButtons(cb) {
    if (!this.state.buttonsVisible) return

    UIManager.measure(findNodeHandle(this.buttons), (x, y, w, h) => {
      let animations = [
        Animated.timing(this.AV.buttons.opacity, {
          toValue: 0,
          duration: 140
        }),
        Animated.timing(this.AV.buttons.marginTop, {
          toValue: -1 * h,
          duration: 140
        }),
        Animated.timing(this.AV.header.borderBottomLeftRadius, {
          toValue: 6,
          duration: 140
        }),
        Animated.timing(this.AV.header.borderBottomRightRadius, {
          toValue: 6,
          duration: 140
        })
      ]

      Animated.parallel(animations).start(() => (cb) ? cb() : null)
    })
  }

  positionLogo(cb) {
    UIManager.measure(findNodeHandle(this.nowWhat), (x, y, w, h) => {
      let animations = [
        Animated.timing(this.AV.logoWrap.paddingBottom, {
          toValue: h + 60,
          duration: 200,
          easing: Easing.elastic(0.9)
        }),
        Animated.timing(this.AV.textWrap.opacity, {
          toValue: 1,
          duration: 150,
          easing: Easing.elastic(0.9)
        })
      ]

      Animated.parallel(animations).start(() => (cb) ? cb() : null)
    })
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
        <Animated.View ref={ref => this.nowWhat = ref} style={[{paddingTop: 40}, this.AV.textWrap]}>
          <View style={{width: dims.width, justifyContent: 'center', alignItems: 'center'}}>

          { /* Top of Header */ }
          <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingTop: 10, paddingBottom: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)', width: dims.width * 0.85, borderTopLeftRadius: 6, borderTopRightRadius: 6}}>
            <EvilIcons name={"question"} size={28} color={colors.deepBlue} />
            <Text style={{fontSize: 18, fontWeight: '400', paddingLeft: 10}}>
              {"Now What?"}
            </Text>
          </View>

          { /* Bottom of Header */ }
          <Animated.View style={[this.AV.header, {padding: 12, backgroundColor: colors.lightGrey, width: dims.width * 0.85}]}>
            <Text style={{fontSize: 15, fontWeight: '400'}}>
              {`We'll set up your ${this.props.subscription.name} subscription and notify you when Payper launches.`}
            </Text>
          </Animated.View>

            { /* Buttons */
              (!this.state.buttonsVisible)
              ? null
              : <Animated.View ref={ref => this.buttons = ref} style={[this.AV.buttons, {borderBottomRightRadius: 6, borderBottomLeftRadius: 6, padding: 12, paddingTop: 0, backgroundColor: colors.lightGrey, width: dims.width * 0.85}]}>
                  <View>
                    { /* Partial Border */ }
                    <View style={{width: 100, height: 1, backgroundColor: colors.medGrey, alignSelf: 'center'}} />

                    { /* Prompt */ }
                    <Text style={{fontSize: 14, fontWeight: '400', color: colors.slateGrey, padding: 6}}>
                      {`Would you like to join with friends or other users from SXSW?`}
                    </Text>

                    { /* Join with SXSW Users Button */ }
                    <TouchableHighlight
                      onPress={() => alert("Join w/ SXSW Users")}
                      underlayColor={'transparent'}>
                      <View style={[styles.button, {backgroundColor: colors.accent}]}>
                        <Text style={{fontSize: 15, fontWeight: '500', color: colors.snowWhite}}>
                          {"Join with SXSW Users"}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                  { /* Invite Friends Button */ }
                  <TouchableHighlight
                    onPress={() => this.setState({modalIsVisible: true})}
                    underlayColor={'transparent'}>
                    <View style={[styles.button, {backgroundColor: colors.gradientGreen}]}>
                      <Text style={{fontSize: 15, fontWeight: '500', color: colors.snowWhite}}>
                        {"Invite Friends"}
                      </Text>
                    </View>
                  </TouchableHighlight>
                </Animated.View>}
          </View>
        </Animated.View>

        { /* Modal */ }
        <Modal animationType={'slide'} visible={this.state.modalIsVisible}>
          <View style={styles.modalWrap}>
            <Header
              showTitle
              showBackButton
              title={"Invite Contacts"}
              onBack={() => this.setState({modalIsVisible: false})} />
            <Invite
              induceState={(substate, shouldSubmit) => {
                this.setState(substate, () => (shouldSubmit) ? this.submit() : null)
              }}
              closeModal={() => this.setState({modalIsVisible: false})}
              submit={() => this.submit()} />
          </View>
        </Modal>
      </View>
    )
  }
}

module.exports = PromoInvite
