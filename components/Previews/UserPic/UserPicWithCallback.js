// Dependencies
import React from 'react';
import { View, Image, Text, Dimensions, TouchableHighlight } from 'react-native';
const dimensions = Dimensions.get('window');

// Stylesheets
import colors from '../../../styles/colors';
import userStyles from '../../../styles/Previews/User';

// Iconography
import Entypo from 'react-native-vector-icons/Entypo';

class UserPicWithCallback extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.user.profile_pic || this.props.user.profile_pic == "") {
      var name = (this.props.user.first_name + " " + this.props.user.last_name).split(" ");
      var initials;
      (name.length > 1)
        ? initials = (name[0].substring(0, 1) + name[name.length - 1].substring(0, 1)).toUpperCase()
        : initials = name[0].substring(0, 1).toUpperCase();
      return(
        <View style={{width: dimensions.width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <View style={[userStyles.pic, userStyles.initials, {width: this.props.width, height: this.props.height, borderColor: (this.props.user.phone) ? colors.icyBlue : colors.accent, borderRadius: this.props.width / 2}]}>
            <Text style={{fontFamily: 'Roboto', fontSize: 18, color: (this.props.user.phone) ? colors.icyBlue : colors.accent}}>{ initials }</Text>
          </View>
        </View>
      );
    } else {
      return(
        <TouchableHighlight
          activeOpacity={0.95}
          underlayColor={'transparent'}
          onPress={() => this.props.callback()}>
          <View style={{width: this.props.width, height: this.props.height, borderRadius: this.props.height / 2, overflow: 'hidden'}}>
            <Image style={{borderWidth: 1, borderColor: (this.props.user.phone && !this.props.accent) ? colors.icyBlue : colors.accent, width: this.props.width, height: this.props.height, borderRadius: this.props.height / 2}} source={{uri: this.props.user.profile_pic}} />
            <View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, left: 0, right: 0, height: this.props.height / 3, backgroundColor: colors.lightAlertGreen}}>
              <Entypo size={16} name="camera" color={colors.white} />
            </View>
          </View>
        </TouchableHighlight>
      );
    }
  }
};

export default UserPicWithCallback;
