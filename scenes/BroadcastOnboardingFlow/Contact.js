import React from 'react'
import {View, StyleSheet, Text, Dimensions, TouchableHighlight} from 'react-native'
import {colors} from '../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  buttonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingRight: 7,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 5
  },
  inactiveButtonText: {
    fontSize: 16,
    paddingLeft: 4,
    color: colors.slateGrey
  },
  activeButtonText: {
    fontSize: 16,
    paddingLeft: 4,
    color: colors.deepBlue
  }
})

class Contact extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedButton: "By phone"
    }
  }

  render() {
    return(
      <View style={styles.container}>

        <View style={{height: 17}} />

        { /* Prompt */ }
        <Text style={{width: dims.width * 0.9, fontSize: 20, fontWeight: '300', color: colors.deepBlue, textAlign: 'center'}}>
          {"How should subscribers reach you?"}
        </Text>

        <View style={{height: 17}} />

        { /* "By phone" button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={() => this.setState({selectedButton: "By phone"})}>
          <View style={styles.buttonWrap}>
            <EvilIcons size={33} name={"check"} color={(this.state.selectedButton === "By phone") ? colors.gradientGreen : colors.slateGrey} />
            <Text style={(this.state.selectedButton === "By phone") ? styles.activeButtonText : styles.inactiveButtonText}>
              {"By phone"}
            </Text>
          </View>
        </TouchableHighlight>

        { /* "By email" button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={() => this.setState({selectedButton: "By email"})}>
          <View style={styles.buttonWrap}>
            <EvilIcons size={33} name={"check"} color={(this.state.selectedButton === "By email") ? colors.gradientGreen : colors.slateGrey} />
            <Text style={(this.state.selectedButton === "By email") ? styles.activeButtonText : styles.inactiveButtonText}>
              {"By email"}
            </Text>
          </View>
        </TouchableHighlight>

      </View>
    )
  }
}

module.exports = Contact
