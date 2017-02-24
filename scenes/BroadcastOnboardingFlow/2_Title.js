import React from 'react'
import {View, StyleSheet, Dimensions, Text} from 'react-native'
import {TextInputWithIcon} from '../../components'
import {colors} from '../../globalStyles'
import Entypo from 'react-native-vector-icons/Entypo'

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
  }
})

class Title extends React.Component {
  constructor(props) {
    super(props)

    this.state = props.state || {
      titleInput: "",
      inputIsValid: false
    }

    this.onChangeText = this.onChangeText.bind(this)
    this.validateInput = this.validateInput.bind(this)
  }

  onChangeText(input) {
    this.setState({titleInput: input}, () => this.props.induceState(this.state, this.props.title))
  }

  validateInput(input) {
    let inputIsValid = input.length > 0
    this.setState({inputIsValid})
  }

  render() {
    return(
      <View style={styles.container}>
        { /* More info */ }
        <View style={styles.infoWrap}>
          <Entypo name={"info-with-circle"} color={colors.accent} size={22} />
          <Text style={styles.infoText}>
            {"Your broadcast's title is the first thing prospective members will see. Be descriptive but concise!"}
          </Text>
        </View>

        { /* Text Input */ }
        <View>
          <TextInputWithIcon
            validateInput={this.validateInput}
            onChangeText={this.onChangeText}
            inputIsValid={this.state.inputIsValid}
            textInputProps={{
              autoCorrect: false,
              autoCapitalize: "words",
              autoFocus: true,
              returnKeyType: "done",
              defaultValue: this.state.titleInput,
              placeholder: "ex. Netflix Subscription",
              placeholderTextColor: colors.slateGrey,
              onSubmitEditing: this.props.next
            }}
            iconProps={{
              name: "pencil",
              color: colors.accent,
              size: 30
            }} />
        </View>
      </View>
    )
  }
}

module.exports = Title
