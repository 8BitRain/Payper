import React from 'react'
import {View, Image, Text} from 'react-native'
import {colors} from '../globalStyles'

class ProfilePic extends React.Component {
  render() {
    if (this.props.currentUser.profilePic) return(
      <Image style={{width: this.props.size, height: this.props.size, borderRadius: this.props.size / 2}} source={{uri: this.props.currentUser.profilePic}} />
    )

    return(
      <View style={{width: this.props.size, height: this.props.size, borderRadius: this.props.size / 2, borderWidth: 1, borderColor: colors.medGrey, backgroundColor: colors.snowWhite, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: colors.deepBlue, fontSize: 18, fontWeight: '200'}}>
          {this.props.currentUser.initials}
        </Text>
      </View>
    )
  }
}

module.exports = ProfilePic
