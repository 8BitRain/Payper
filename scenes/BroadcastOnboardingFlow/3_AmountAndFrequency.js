import React from 'react'
import {View, StyleSheet, Dimensions, Text, TouchableHighlight} from 'react-native'
import {colors} from '../../globalStyles'
import {TextInputWithIcon} from '../../components'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  infoWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 4,
    width: dims.width * 0.85
  },
  infoText: {
    marginTop: 6,
    fontSize: 17,
    color: colors.deepBlue,
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  warningText: {
    fontSize: 14,
    padding: 4,
    color: colors.slateGrey
  },
  frequencyButtonsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: dims.width * 0.9,
    paddingTop: 10
  },
  frequencyButtonWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 9,
    paddingRight: 11,
    borderWidth: 1,
    borderColor: colors.medGrey,
    borderRadius: 5
  },
  inactiveFrequencyButtonText: {
    fontSize: 18,
    paddingLeft: 7,
    color: colors.slateGrey
  },
  activeFrequencyButtonText: {
    fontSize: 18,
    paddingLeft: 7,
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
    if (parseInt(input) < 1 || parseInt(input) > 2999) {
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

        { /* More info */ }
        <View style={styles.infoWrap}>
          <Entypo name={"info-with-circle"} color={colors.accent} size={22} />
          <Text style={styles.infoText}>
            {"Enter payment amount per cast member, per interval."}
          </Text>
        </View>

        { /* Text Input */ }
        <View>
          <TextInputWithIcon
            validateInput={this.validateInput}
            onChangeText={this.onAmountChangeText}
            inputIsValid={this.state.amountInputIsValid}
            textInputProps={{
              keyboardType: "decimal-pad",
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
          ? <Text style={styles.warningText}>{"Payment amount must be between $1 and $3,000."}</Text>
          : null }

        { /* Frequency buttons */ }
        <View style={styles.frequencyButtonsWrap}>
          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={'transparent'}
            onPress={() => this.onFrequencyChange("MONTHLY")}>
            <View style={styles.frequencyButtonWrap}>
              <EvilIcons size={30} name={"check"} color={(this.state.frequencyInput === "MONTHLY") ? colors.gradientGreen : colors.slateGrey} />
              <Text style={(this.state.frequencyInput === "MONTHLY") ? styles.activeFrequencyButtonText : styles.inactiveFrequencyButtonText}>
                {"Per Month"}
              </Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={'transparent'}
            onPress={() => this.onFrequencyChange("WEEKLY")}>
            <View style={styles.frequencyButtonWrap}>
              <EvilIcons size={30} name={"check"} color={(this.state.frequencyInput === "WEEKLY") ? colors.gradientGreen : colors.slateGrey} />
              <Text style={(this.state.frequencyInput === "WEEKLY") ? styles.activeFrequencyButtonText : styles.inactiveFrequencyButtonText}>
                {"Per Week"}
              </Text>
            </View>
          </TouchableHighlight>
        </View>

      </View>
    )
  }
}

module.exports = AmountAndFrequency
