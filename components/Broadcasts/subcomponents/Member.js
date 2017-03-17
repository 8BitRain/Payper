import React from 'react'
import moment from 'moment'
import {View, Text, TouchableHighlight} from 'react-native'
import {colors} from '../../../globalStyles'
import {ProfilePic} from '../../'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

class Member extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8}}>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          { /* Profile Pic */ }
          <ProfilePic currentUser={this.props.member} size={42} />

          { /* Display Name */ }
          <View style={{paddingLeft: 8}}>
            <Text style={{color: colors.deepBlue, fontSize: 16, fontWeight: '400'}}>
              {`${this.props.member.firstName} ${this.props.member.lastName}`}
            </Text>
            <Text style={{color: colors.slateGrey, fontSize: 13, fontWeight: '400'}}>
              {`Joined ${moment(this.props.member.joinedAt).format("MMM D, YYYY")}`}
            </Text>
          </View>
        </View>

        { /* Remove button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={() => this.props.remove(this.props.member)}>
          <View style={{
            backgroundColor: colors.snowWhite,
            padding: 8,
            borderWidth: 1,
            borderColor: colors.medGrey,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.medGrey,
            shadowOpacity: 1.0,
            shadowRadius: 2,
            shadowOffset: {
              height: 0,
              width: 0
            }
          }}>
            <Text style={{fontSize: 15, color: colors.carminePink}}>
              {"Remove"}
            </Text>
          </View>
        </TouchableHighlight>

      </View>
    )
  }
}

module.exports = Member
