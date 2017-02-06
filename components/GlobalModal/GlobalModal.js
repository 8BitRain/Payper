import React from 'react'
import {Actions} from 'react-native-router-flux'
import {View, TouchableHighlight, Text, Dimensions, Modal, Image} from 'react-native'
import {colors} from '../../globalStyles'
import {IAVWebView} from '../../components'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
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
    let {subcomponent, animationType, showHeader, title, backgroundColor} = this.props
    let {hidden} = this.state
    let {wrap} = this.styles

    return(
      <Modal visible={!hidden} animationType={animationType || 'slide'}>
        <View style={{flex: 1.0, backgroundColor: backgroundColor || colors.snowWhite}}>

          {(!showHeader)
            ? null
            : <View style={{overflow: 'hidden', zIndex: 0}}>
                <Image source={require('../../assets/images/bg-header.jpg')} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} />
                <View style={{padding: 12, paddingTop: 27, flexDirection: 'row', justifyContent: 'center', backgroundColor: 'transparent'}}>
                  <Text style={{color: colors.lightGrey, fontSize: 17, backgroundColor: 'transparent'}}>
                    {title || ""}
                  </Text>

                  <TouchableHighlight
                    activeOpacity={0.75}
                    underlayColor={'transparent'}
                    style={{position: 'absolute', top: 0, left: 0, bottom: 0, padding: 14, paddingTop: 30, justifyContent: 'center'}}
                    onPress={() => this.dismiss()}>
                    <EvilIcons name={"close"} color={colors.snowWhite} size={24} />
                  </TouchableHighlight>
                </View>
              </View> }

          {subcomponent}

        </View>
      </Modal>
    )
  }
}

module.exports = GlobalModal
