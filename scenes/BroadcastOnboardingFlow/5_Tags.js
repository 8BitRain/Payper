import React from 'react'
import {View, Text, StyleSheet, Slider, Dimensions, TextInput} from 'react-native'
import {colors} from '../../globalStyles'
import {DropdownList, TextInputWithIcon} from '../../components'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
})

class Tags extends React.Component {
  constructor(props) {
    super(props)

    this.state = props.state || {
      inputIsValid: false,
      query: ""
    }

    this.data = []

    for (var cat in props.tags) {
      let data = props.tags[cat]
      this.data.push({category: data.displayName, rows: data})
    }

    this.onChangeText = this.onChangeText.bind(this)
    this.validateInput = this.validateInput.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.state && nextProps.state.query)
      this.setState({query: nextProps.state.query, inputIsValid: true})
  }

  onChangeText(input) {
    this.dropdownList.filter(input)
  }

  validateInput(input) {
    this.setState({inputIsValid: input.length > 0})
  }

  render() {
    return(
      <View style={styles.container}>

        { /* Search bar */ }
        <TextInputWithIcon
          validateInput={this.validateInput}
          onChangeText={this.onChangeText}
          inputIsValid={this.state.inputIsValid}
          textInputProps={{
            autoCorrect: false,
            autoCapitalize: "words",
            autoFocus: true,
            returnKeyType: "done",
            defaultValue: this.state.query,
            placeholder: "Search tags or create one",
            placeholderTextColor: colors.slateGrey
          }}
          iconProps={{
            name: "pencil",
            color: colors.accent,
            size: 30
          }} />

        { /* List of tags */ }
        <DropdownList
          ref={(ref) => (this.dropdownList) ? null : this.dropdownList = ref}
          induceState={(substate) => this.props.induceState(substate, this.props.title)}
          keyboardDismissMode={"on-drag"}
          selectionLimit={1}
          state={this.props.state}
          data={this.data} />

      </View>
    )
  }
}

module.exports = Tags
