import React from 'react'
import moment from 'moment'
import {Actions} from 'react-native-router-flux'
import {View, Text, TouchableHighlight} from 'react-native'
import {requestCast} from '../../helpers/lambda'
import {colors} from '../../globalStyles'
import {ProfilePic} from '../'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

class MatchedUser extends React.Component {
  constructor(props) {
    super(props)
    console.log("--> MatchedUser was constructed with props:", props)
  }

  handlePress() {
    if (this.props.user.matchType === "theyOwn") {
      requestCast({
        token: this.props.currentUser.token,
        matchedUser: this.props.user.uid,
        tag: this.props.tag
      })
    } else if (this.props.user.matchType === "youOwn" || this.props.user.matchType === "bothWant") {
      alert("Would create cast")
    }
  }

  render() {
    return(
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 0, marginBottom: 3, marginLeft: 6, marginRight: 4}}>

        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={() => Actions.UserProfile({user: this.props.user})}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            { /* Profile Pic */ }
            <ProfilePic currentUser={this.props.user} size={38} />

            { /* Display Name */ }
            <View style={{paddingLeft: 8}}>
              <Text style={{color: colors.deepBlue, fontSize: 15, fontWeight: '400'}}>
                {`${this.props.user.firstName} ${this.props.user.lastName}`}
              </Text>
              <Text style={{color: colors.slateGrey, fontSize: 13, fontWeight: '400'}}>
                {`${this.props.user.firstName} ${(this.props.user.matchType === 'theyOwn') ? 'owns' : 'wants'} this.`}
              </Text>
            </View>
          </View>
        </TouchableHighlight>

        { /* 'Create Cast' or 'Request Cast' button */ }
        <TouchableHighlight
          activeOpacity={0.75}
          underlayColor={'transparent'}
          onPress={() => this.handlePress()}>
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
            shadowRadius: 1,
            shadowOffset: {
              height: 0,
              width: 0
            }
          }}>
            <Text style={{fontSize: 14, color: colors.accent}}>
              {(this.props.user.matchType === "theyOwn") ? "Request Cast" : "Create Cast"}
            </Text>
          </View>
        </TouchableHighlight>

      </View>
    )
  }
}

module.exports = MatchedUser
