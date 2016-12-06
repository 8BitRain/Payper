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

    this.state = {
      modalVisible: false,
      focusedTile: null,
      tiles: [
        {
          iconName: "user",
          title: "Display Name",
          placeholder: "Enter your display name",
          current: "Brady Sheridan",
          focused: false,
          height: new Animated.Value(dims.width * 0.5),
          width: new Animated.Value(dims.width * 0.5),
          opacity: new Animated.Value(1.0)
        },
        {
          iconName: "image",
          title: "Profile Picture",
          placeholder: "Upload a profile picture",
          focused: false,
          height: new Animated.Value(dims.width * 0.5),
          width: new Animated.Value(dims.width * 0.5),
          opacity: new Animated.Value(1.0)
        },
        {
          iconName: "envelope",
          title: "Email Address",
          placeholder: "Enter your email address",
          focused: false,
          height: new Animated.Value(dims.width * 0.5),
          width: new Animated.Value(dims.width * 0.5),
          opacity: new Animated.Value(1.0)
        },
        {
          iconName: "location",
          title: "Billing Address",
          placeholder: "Enter your billing address",
          focused: false,
          height: new Animated.Value(dims.width * 0.5),
          width: new Animated.Value(dims.width * 0.5),
          opacity: new Animated.Value(1.0)
        },
        {
          iconName: "lock",
          title: "Social Security Number",
          placeholder: "Enter the last four digits of your SSN",
          focused: false,
          height: new Animated.Value(dims.width * 0.5),
          width: new Animated.Value(dims.width * 0.5),
          opacity: new Animated.Value(1.0)
        }
      ]
    }
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
        <ScrollView contentContainerStyle={{flex: 0.9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
          {this.state.tiles.map((tile, i) => <Tile {...tile} onPress={() => this.toggleTile(i)} leftAligned={i % 2 === 0} key={tile.title} />)}
        </ScrollView>
      </View>
    )
  }
}

module.exports = OnboardingView
