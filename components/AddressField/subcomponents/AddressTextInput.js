import React from 'react'
import {View, Text, TextInput} from 'react-native'
import {colors} from '../../../globalStyles'

class AddressTextInput extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={[{marginTop: 15, borderWidth: 1, borderColor: colors.medGrey, borderRadius: 4}, this.props.containerStyles]}>
        <Text style={[{fontSize: 15, color: colors.deepBlue, backgroundColor: colors.snowWhite, position: 'absolute', top: -11, left: 7, paddingLeft: 5, paddingRight: 5}, this.props.labelStyles]}>
          {this.props.label || ""}
        </Text>

        <TextInput
          ref={(ref) => this.props.induceInputRef(this.props.label, ref)}
          style={[{flex: 1.0, height: 44, paddingLeft: 14}, this.props.textInputStyles]}
          {...this.props.textInputProps} />
      </View>
    )
  }
}

module.exports = AddressTextInput
