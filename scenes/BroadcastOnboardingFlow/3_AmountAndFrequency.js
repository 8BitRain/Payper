import React from 'react'
import {View, StyleSheet, Dimensions, Text, TouchableHighlight} from 'react-native'
import {colors} from '../../globalStyles'
import {TextInputWithIcon, InfoBox} from '../../components'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  warningText: {
    fontSize: 14,
    padding: 4,
    color: colors.slateGrey
  },
  frequencyButtonsWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: dims.width * 0.9,
    paddingTop: 10
  },
  frequencyButtonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingRight: 7,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 5
  },
  inactiveFrequencyButtonText: {
    fontSize: 16,
    paddingLeft: 4,
    color: colors.slateGrey
  },
  activeFrequencyButtonText: {
    fontSize: 16,
    paddingLeft: 4,
    color: colors.deepBlue
  }
})

class AmountAndFrequency extends React.Component {
  constructor(props) {
    super(props)

    this.state = props.state || {
      amountInput: "",
      frequencyInput: "MONTHLY",
      amountInputIsValid: false
    }

    this.onAmountChangeText = this.onAmountChangeText.bind(this)
    this.validateInput = this.validateInput.bind(this)
  }

  onAmountChangeText(input) {
    this.setState({amountInput: input}, () => this.props.induceState(this.state, this.props.title))
  }

  onFrequencyChange(input) {
    this.setState({frequencyInput: input}, () => this.props.induceState(this.state, this.props.title))
  }

  validateInput(input) {
    // Validate input existence
    if (!input) {
      this.setState({amountInputIsValid: false})
      return
    }

    // Validate input amount
    if (parseInt(input) < 1 || parseInt(input) > 200) {
      this.setState({
        amountIsOutOfRange: true,
        amountInputIsValid: false
      })
      return
    } else {
      this.setState({amountIsOutOfRange: false})
    }

    // Validate number of decimals (should be 0 or 1)
    let buffer = input.split(".")
    let numberOfDecimals = buffer.length - 1
    if (numberOfDecimals > 1) {
      this.setState({amountInputIsValid: false})
      return
    }

    // Validate number of figures after decimal place (should be 2)
    let centsValue = buffer[1]
    if (centsValue === "" || centsValue && centsValue.length !== 2) {
      this.setState({amountInputIsValid: false})
      return
    }

    this.setState({amountInputIsValid: true})
  }

  render() {
    return(
      <View style={styles.container}>

        { /* Text Input */ }
        <View style={{paddingTop: 15}}>
          <Text style={{fontSize: 17, color: colors.deepBlue}}>
            {"Enter amount per person:"}
          </Text>

          <TextInputWithIcon
            validateInput={this.validateInput}
            onChangeText={this.onAmountChangeText}
            inputIsValid={this.state.amountInputIsValid}
            textInputProps={{
              keyboardType: "decimal-pad",
              autoFocus: true,
              autoCorrect: false,
              defaultValue: this.state.amountInput,
              placeholder: "0.00",
              placeholderTextColor: colors.slateGrey,
              onSubmitEditing: this.props.next
            }}
            insteadOfIcon={() => <Text style={{fontSize: 18, color: colors.deepBlue}}>{"$"}</Text>} />
        </View>

        { /* Invalid payment amount warning */
          (this.state.amountIsOutOfRange)
          ? <Text style={styles.warningText}>{"Payment amount must be between $1 and $200."}</Text>
          : null }

        { /* Frequency buttons */ }
        <View style={{padding: 15}}>
          <Text style={{fontSize: 17, color: colors.deepBlue}}>
            {"Select payment frequency:"}
          </Text>

          <View style={styles.frequencyButtonsWrap}>
            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={() => this.onFrequencyChange("MONTHLY")}>
              <View style={styles.frequencyButtonWrap}>
                <EvilIcons size={27} name={"check"} color={(this.state.frequencyInput === "MONTHLY") ? colors.gradientGreen : colors.slateGrey} />
                <Text style={(this.state.frequencyInput === "MONTHLY") ? styles.activeFrequencyButtonText : styles.inactiveFrequencyButtonText}>
                  {"Monthly"}
                </Text>
              </View>
            </TouchableHighlight>

            <View style={{width: 6}} />

            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={() => this.onFrequencyChange("WEEKLY")}>
              <View style={styles.frequencyButtonWrap}>
                <EvilIcons size={27} name={"check"} color={(this.state.frequencyInput === "WEEKLY") ? colors.gradientGreen : colors.slateGrey} />
                <Text style={(this.state.frequencyInput === "WEEKLY") ? styles.activeFrequencyButtonText : styles.inactiveFrequencyButtonText}>
                  {"Weekly"}
                </Text>
              </View>
            </TouchableHighlight>

            <View style={{width: 6}} />

            <TouchableHighlight
              activeOpacity={0.75}
              underlayColor={'transparent'}
              onPress={() => this.onFrequencyChange("ONCE")}>
              <View style={styles.frequencyButtonWrap}>
                <EvilIcons size={27} name={"check"} color={(this.state.frequencyInput === "ONCE") ? colors.gradientGreen : colors.slateGrey} />
                <Text style={(this.state.frequencyInput === "ONCE") ? styles.activeFrequencyButtonText : styles.inactiveFrequencyButtonText}>
                  {"Once"}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>

      </View>
    )
  }
}

module.exports = AmountAndFrequency
