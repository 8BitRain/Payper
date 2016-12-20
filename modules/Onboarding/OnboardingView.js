import React from 'react'
import { View, ScrollView, Animated, StatusBar, Image, TouchableHighlight, Text, Dimensions, Modal, TextInput } from 'react-native'
import { colors } from '../../globalStyles'
import { Tile, Input } from './subcomponents'
import { StickyView } from '../../components'
import * as animate from './animate'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
const dims = Dimensions.get('window')

class OnboardingView extends React.Component {
  constructor(props) {
    super(props)

    this.update = this.update.bind(this)

    let { displayName, phone, emailAddress, billingAddress, ssn } = this.props.currentUser

    this.state = {
      modalVisible: false,
      focusedTile: null,
      tiles: [
        {
          iconName: "user",
          title: "Display Name",
          focused: false,
          value: displayName || "",
          height: new Animated.Value(dims.width * 0.5),
          width: new Animated.Value(dims.width * 0.5),
          opacity: new Animated.Value(1.0),
          update: this.update,
          textInputProps: {
            placeholder: "Enter your display name",
            keyboardType: "default",
            autoCapitalize: "words",
            autoCorrect: false
          }
        },
        {
          iconName: "image",
          title: "Profile Picture",
          focused: false,
          value: phone || "",
          height: new Animated.Value(dims.width * 0.5),
          width: new Animated.Value(dims.width * 0.5),
          opacity: new Animated.Value(1.0),
          update: this.update,
          textInputProps: {
            placeholder: "Upload a profile picture",
            keyboardType: "default",
            autoCapitalize: "none",
            autoCorrect: false
          }
        },
        {
          iconName: "envelope",
          title: "Email Address",
          focused: false,
          value: emailAddress || "",
          height: new Animated.Value(dims.width * 0.5),
          width: new Animated.Value(dims.width * 0.5),
          opacity: new Animated.Value(1.0),
          update: this.update,
          textInputProps: {
            placeholder: "Enter your email address",
            keyboardType: "email-address",
            autoCapitalize: "none",
            autoCorrect: false
          }
        },
        {
          iconName: "location",
          title: "Billing Address",
          focused: false,
          value: billingAddress.toString() || "",
          height: new Animated.Value(dims.width * 0.5),
          width: new Animated.Value(dims.width * 0.5),
          opacity: new Animated.Value(1.0),
          update: this.update,
          textInputProps: {
            placeholder: "Enter your billing address",
            keyboardType: "default",
            autoCapitalize: "words",
            autoCorrect: false
          }
        },
        {
          iconName: "lock",
          focused: false,
          value: ssn || "",
          height: new Animated.Value(dims.width * 0.5),
          width: new Animated.Value(dims.width * 0.5),
          opacity: new Animated.Value(1.0),
          update: this.update,
          title: "Social Security Number",
          textInputProps: {
            placeholder: "Enter the last four digits of your SSN",
            keyboardType: "number-pad",
            autoCapitalize: "none",
            autoCorrect: false
          }
        }
      ]
    }
  }

  update(i, value) {
    let updatedState = this.state
    updatedState.tiles[i].value = value
    this.setState(updatedState)
  }

  reset() {
    this.setState({focusedTile: null})
    this.toggleModal()
    animate.show(this.tiles, null, this.animatedValues)
    animate.shrink(this.state.focusedTile, this.animatedValues)
  }

  focus(tile) {
    this.setState({focusedTile: tile})
    animate.hide(this.tiles, tile, this.animatedValues, () => {
      animate.expand(tile, this.animatedValues, () => {
        this.toggleModal(tile)
      })
    })
  }

  toggleModal() {
    this.setState({modalVisible: true})
  }

  toggleTile(i) {
    let newState = this.state
    let target = newState.tiles[i]

    // Focus the pressed tile
    target.focused = !target.focused

    // Unfocus other tiles
    for (var k in newState.tiles) {
      let curr = newState.tiles[k]
      if (curr !== target && curr.focused === true) curr.focused = false
    }

    this.setState(newState)
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
        <ScrollView
          keyboardShouldPersistTaps
          contentContainerStyle={{flex: 0.9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
          {this.state.tiles.map((tile, i) => <Tile {...tile} tileIndex={i} onPress={() => this.toggleTile(i)} leftAligned={i % 2 === 0} key={tile.title} />)}
        </ScrollView>
      </View>
    )
  }
}

module.exports = OnboardingView
