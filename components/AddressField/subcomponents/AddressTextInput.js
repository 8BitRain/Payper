import React from 'react'
import {View, Text, TextInput} from 'react-native'
import {colors} from '../../../globalStyles'
import DeviceInfo from 'react-native-device-info'

class AddressTextInput extends React.Component {
  constructor(props) {
    super(props)

    this.textInputMT = DeviceInfo.getSystemName() == "Android" ? 10 : 0;
    this.labelTop = DeviceInfo.getSystemName() == "Android" ? 0 : -11;
  }

  render() {
    return(
      <View style={[{marginTop: 15, borderWidth: 1, borderColor: colors.medGrey, borderRadius: 4}, this.props.containerStyles]}>
        <Text style={[{fontSize: 15, color: colors.deepBlue, backgroundColor: colors.snowWhite, position: 'absolute', top: this.labelTop, left: 7, paddingLeft: 5, paddingRight: 5, zIndex: 1}, this.props.labelStyles]}>
          {this.props.label || ""}
        </Text>

        <TextInput
          ref={(ref) => this.props.induceInputRef(this.props.label, ref)}
          style={[{flex: 1.0, height: 44, paddingLeft: 14, marginTop: this.textInputMT}, this.props.textInputStyles]}
          {...this.props.textInputProps} />
      </View>
    )
  }
}

module.exports = AddressTextInput
