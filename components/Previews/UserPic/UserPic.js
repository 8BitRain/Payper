import React from 'react'
import { View, Image, Text, TouchableHighlight } from 'react-native'
import { colors } from '../../../globalStyles'
import userStyles from '../../../styles/Previews/User'

class UserPic extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (!this.props.user.profile_pic || this.props.user.profile_pic == "") {
      var name = (this.props.user.first_name + " " + this.props.user.last_name).split(" ")
      var initials
      (name.length > 1)
        ? initials = (name[0].substring(0, 1) + name[name.length - 1].substring(0, 1)).toUpperCase()
        : initials = name[0].substring(0, 1).toUpperCase()
      return(
        <View style={[userStyles.pic, userStyles.initials, {width: this.props.width, height: this.props.height, borderColor: (this.props.user.provider || this.props.user.username || this.props.accent) ? colors.accent : colors.gradientGreen, borderRadius: this.props.width / 2}]}>
          <Text style={{fontFamily: 'Roboto', fontSize: (this.props.width >= 50) ? 18 : 14, color: (this.props.user.provider || this.props.user.username) ? colors.accent : colors.gradientGreen}}>{ initials }</Text>
        </View>
      )
    } else {
      return <Image style={{borderWidth: 1, borderColor: (this.props.user.provider || this.props.user.username || this.props.accent) ? colors.accent : colors.gradientGreen, width: this.props.width, height: this.props.height, borderRadius: this.props.height / 2}} source={{uri: this.props.user.profile_pic}} />
    }
  }
}

export default UserPic
