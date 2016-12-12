import React from 'react'
import { View, TouchableHighlight, Text, Dimensions } from 'react-native'
import { UserPic } from '../../../components'
import { colors } from '../../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import * as StringMaster5000 from '../../../helpers/StringMaster5000'
const dims = Dimensions.get('window')

class UserRow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.props,
      selected: this.props.selected
    }
  }

  toggleSelect() {
    this.setState({selected: !this.state.selected})
    this.props.toggleSelect()
  }

  render() {
    let {selected} = this.state
    let {user} = this.props

    return(
      <TouchableHighlight
        activeOpacity={0.75}
        underlayColor={'transparent'}
        onPress={() => this.toggleSelect()}>
        <View style={{width: dims.width * 0.9, borderBottomWidth: 1, borderBottomColor: colors.lightGrey, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 8, paddingBottom: 8}}>
          { /* Profile pic */ }
          <UserPic width={40} height={40} user={user} />

          { /* Name and username */ }
          <View style={{flexDirection: 'column', paddingLeft: 10}}>
            <Text style={{color: colors.deepBlue, fontSize: 16}}>
              {user.first_name + " " + user.last_name}
            </Text>
            <Text style={{color: (user.username) ? colors.accent : colors.gradientGreen, fontSize: 14}}>
              {user.username || StringMaster5000.stylizePhoneNumber(user.phone)}
            </Text>
          </View>

          { /* (+) or (√) */ }
          <View style={{position: 'absolute', top: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
            <EvilIcons name={(selected) ? "check" : "plus"} color={(selected) ? colors.gradientGreen : colors.medGrey} size={30} />
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = UserRow
