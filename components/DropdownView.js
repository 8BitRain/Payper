import React from 'react'
import {View, TouchableHighlight, Text, Dimensions, StyleSheet, Animated, ScrollView} from 'react-native'
import {colors} from '../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    width: dims.width
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: dims.width,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 14,
    paddingRight: 14,
    borderColor: colors.lightGrey,
    borderBottomWidth: 1
  },
  headerText: {
    fontSize: 18,
    color: colors.deepBlue
  },
  dropdownContent: {
    borderColor: colors.medGrey,
    borderBottomWidth: 1,
    overflow: 'hidden'
  }
})

class DropdownList extends React.Component {
  constructor(props) {
    super(props)

    this.AV = {
      height: new Animated.Value(0),
      opacity: new Animated.Value(0)
    }

    this.state = {
      dropdownContentIsVisible: false
    }

    this.toggle = this.toggle.bind(this)
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
  }

  toggle() {
    this.setState({dropdownContentIsVisible: !this.state.dropdownContentIsVisible}, () => {
      if (this.state.dropdownContentIsVisible) this.show()
      else this.hide()
    })
  }

  show() {
    let animations = [
      Animated.timing(this.AV.height, {
        toValue: 50,
        duration: 100
      }),
      Animated.timing(this.AV.opacity, {
        toValue: 1,
        duration: 65
      })
    ]

    Animated.sequence(animations).start()
  }

  hide() {
    let animations = [
      Animated.timing(this.AV.opacity, {
        toValue: 0,
        duration: 65
      }),
      Animated.timing(this.AV.height, {
        toValue: 0,
        duration: 100
      })
    ]

    Animated.sequence(animations).start()
  }

  render() {
    return(
      <View style={styles.container}>

        { /* Header */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={this.toggle}>
          <View style={styles.header}>

            { /* Title */ }
            <Text style={styles.headerText}>
              {this.props.headerText}
            </Text>

            { /* Chevron */ }
            <EvilIcons
              name={(this.state.dropdownContentIsVisible) ? "chevron-up" : "chevron-down"}
              size={34}
              color={colors.slateGrey} />

          </View>
        </TouchableHighlight>

        { /* Dropdown Content */ }
        <Animated.View style={[styles.dropdownContent, {height: this.AV.height, opacity: this.AV.opacity}]}>
          {this.props.dropdownContent}
        </Animated.View>

      </View>
    )
  }
}

module.exports = DropdownList
