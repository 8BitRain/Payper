import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View, TouchableHighlight, Text, Dimensions, Modal} from 'react-native'
import {colors} from '../../globalStyles'
const dims = Dimensions.get('window')

class GlobalModal extends React.Component {
  constructor(props) {
    super(props)

    this.styles = {
      wrap: {
        flex: 1.0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: props.backgroundColor || colors.snowWhite
      }
    }

    this.state = {
      hidden: false
    }
  }

  dismiss() {
    Actions.pop()
  }

  render() {
    let {subcomponent, animationType} = this.props
    let {hidden} = this.state
    let {wrap} = this.styles

    return(
      <Modal visible={!hidden} animationType={animationType || 'slide'} style={wrap}>
        {subcomponent}
      </Modal>
    )
  }
}

module.exports = GlobalModal
