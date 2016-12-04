import React from 'react'
import { View, ScrollView, Animated, StatusBar, Image, TouchableHighlight, Text, Dimensions, Modal, TextInput } from 'react-native'
import { colors } from '../../globalStyles'
import { Tile, Input } from './subcomponents'
import { StickyView } from '../../components'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

class OnboardingView extends React.Component {
  constructor(props) {
    super(props)

    this.tiles = ["displayName", "profilePicture", "emailAddress", "billingAddress", "socialSecurityNumber"]

    this.inputProps = {
      displayName: {
        placeholder: "Enter your display name",
        placeholderTextColor: colors.slateGrey
      },
      emailAddress: {
        placeholder: "Enter your email address",
        placeholderTextColor: colors.slateGrey
      },
      socialSecurityNumber: {
        placeholder: "Enter the last four digits of your SSN",
        placeholderTextColor: colors.slateGrey
      }
    }

    this.animatedValues = {
      heights: {
        displayName: new Animated.Value(dims.width * 0.5),
        profilePicture: new Animated.Value(dims.width * 0.5),
        emailAddress: new Animated.Value(dims.width * 0.5),
        billingAddress: new Animated.Value(dims.width * 0.5),
        socialSecurityNumber: new Animated.Value(dims.width * 0.5)
      },
      widths: {
        displayName: new Animated.Value(dims.width * 0.5),
        profilePicture: new Animated.Value(dims.width * 0.5),
        emailAddress: new Animated.Value(dims.width * 0.5),
        billingAddress: new Animated.Value(dims.width * 0.5),
        socialSecurityNumber: new Animated.Value(dims.width * 0.5)
      },
      opacities: {
        displayName: new Animated.Value(1),
        profilePicture: new Animated.Value(1),
        emailAddress: new Animated.Value(1),
        billingAddress: new Animated.Value(1),
        socialSecurityNumber: new Animated.Value(1)
      }
    }

    this.state = {
      modalVisible: false
    }
  }

  focus(tile) {
    this.hide(this.tiles, tile, () => {
      this.expand(tile, () => {
        this.toggleModal(tile)
      })
    })
  }

  expand(tile, cb) {
    let { widths } = this.animatedValues
    let width = widths[tile]
    let min = dims.width * 0.5
    let max = dims.width

    Animated.timing(width, {
      toValue: (width._value === min) ? max : min,
      duration: 125
    }).start(() => (typeof cb === 'function') ? cb() : null)
  }

  hide(tiles, tileToSkip, cb) {
    let { heights, opacities } = this.animatedValues
    let animationSequence = []

    for (var i in tiles) {
      let tile = tiles[i]
      if (tile === tileToSkip) continue

      let height = heights[tile]
      let opacity = opacities[tile]

      animationSequence.push(
        Animated.parallel([
          Animated.timing(height, {
            toValue: (height._value > 0) ? 0 : (dims.width * 0.5),
            duration: 200
          }),
          Animated.timing(opacity, {
            toValue: (opacity._value > 0) ? 0 : 1,
            duration: 100
          })
        ])
      )
    }

    Animated.parallel(animationSequence).start(() => cb())
  }

  toggleModal(inputting, cb) {
    let updatedState = {}
    updatedState.modalVisible = !this.state.modalVisible

    if (updatedState.modalVisible) updatedState.inputProps = this.inputProps[inputting]
    else updatedState.inputProps = {}

    this.setState(updatedState, () =>console.log(this.state))
  }

  render() {
    return(
      <View style={{flex: 1.0, flexDirection: 'column'}}>
        <StatusBar barStyle={"light-content"} />

        { /* Header */ }
        <View style={{overflow: 'hidden'}}>
          <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />

          <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
            <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
              {"My Profile"}
            </Text>

            <TouchableHighlight
              activeOpacity={0.8}
              underlayColor={'transparent'}
              onPress={() => alert("Would close")}
              style={{position: 'absolute', top: 0, bottom: 0, left: 6, paddingTop: 28, paddingLeft: 10, paddingRight: 10, backgroundColor: 'transparent'}}>
              <EvilIcons name={"close"} size={24} color={colors.lightGrey} />
            </TouchableHighlight>
          </View>
        </View>

        { /* Tiles */ }
        <ScrollView contentContainerStyle={{flex: 0.9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
          <Tile complete
            height={this.animatedValues.heights["displayName"]}
            width={this.animatedValues.widths["displayName"]}
            opacity={this.animatedValues.opacities["displayName"]}
            marginLeft={10}
            marginRight={5}
            iconName={"user"}
            title={"Display\nName"}
            onPress={() => this.focus("displayName")} />
          <Tile
            height={this.animatedValues.heights["profilePicture"]}
            width={this.animatedValues.widths["profilePicture"]}
            opacity={this.animatedValues.opacities["profilePicture"]}
            marginLeft={5}
            marginRight={10}
            iconName={"image"}
            title={"Profile\nPicture"}
            onPress={() => this.focus("profilePicture")} />
          <Tile complete
            height={this.animatedValues.heights["emailAddress"]}
            width={this.animatedValues.widths["emailAddress"]}
            opacity={this.animatedValues.opacities["emailAddress"]}
            marginLeft={10}
            marginRight={5}
            iconName={"envelope"}
            title={"Email\nAddress"}
            onPress={() => this.focus("emailAddress")} />
          <Tile
            height={this.animatedValues.heights["billingAddress"]}
            width={this.animatedValues.widths["billingAddress"]}
            opacity={this.animatedValues.opacities["billingAddress"]}
            marginLeft={5}
            marginRight={10}
            iconName={"location"}
            title={"Billing\nAddress"}
            onPress={() => this.focus("billingAddress")} />
          <Tile
            height={this.animatedValues.heights["socialSecurityNumber"]}
            width={this.animatedValues.widths["socialSecurityNumber"]}
            opacity={this.animatedValues.opacities["socialSecurityNumber"]}
            marginLeft={10}
            marginRight={5}
            iconName={"lock"}
            title={"Social\nSecurity\nNumber"}
            onPress={() => this.focus("socialSecurityNumber")} />
        </ScrollView>

        <Modal visible={this.state.modalVisible} animationType={"slide"} transparent={true}>
          <StickyView style={{flexDirection: 'row', flex: 1.0, width: dims.width, backgroundColor: colors.lightGrey}}>

            { /* Cancel button */ }
            <TouchableHighlight
              activeOpacity={0.65}
              underlayColor={'transparent'}
              onPress={() => alert("Would cancel")}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{justifyContent: 'center', alignItems: 'center', padding: 8}}>
                <EvilIcons name={"close-o"} size={30} color={colors.carminePink} />
                <View style={{position: 'absolute', top: 4, bottom: 4, right: 0, width: 1, backgroundColor: colors.medGrey}} />
              </View>
            </TouchableHighlight>

            <TextInput
              {...this.state.inputProps}
              autoFocus
              style={{flex: 0.65, height: 50, paddingLeft: 15, paddingRight: 15}} />

            { /* Submit button */ }
            <TouchableHighlight
              activeOpacity={0.65}
              underlayColor={'transparent'}
              onPress={() => alert("Would submit")}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{justifyContent: 'center', alignItems: 'center', padding: 8}}>
                <EvilIcons name={"check"} size={30} color={colors.gradientGreen} />
                <View style={{position: 'absolute', top: 4, bottom: 4, left: 0, width: 1, backgroundColor: colors.medGrey}} />
              </View>
            </TouchableHighlight>
          </StickyView>
        </Modal>
      </View>
    )
  }
}

module.exports = OnboardingView
