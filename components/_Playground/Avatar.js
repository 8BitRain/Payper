// Dependencies
import React from 'react';
import { View, Image, Text, TouchableHighlight, StyleSheet } from 'react-native';
import colors from '../../styles/colors';

class Avatar extends React.Component {
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
        <View style={[styles.pic, styles.initials, {width: this.props.width, height: this.props.height, borderColor: colors.richBlack, borderRadius: this.props.width / 2}]}>
          <Text style={{fontFamily: 'Roboto', fontSize: 18, fontWeight: '200', color: colors.richBlack}}>{ initials }</Text>
        </View>
      );
    } else {
      return <Image style={{borderWidth: 0.5, borderColor: colors.richBlack, width: this.props.width, height: this.props.height, borderRadius: this.props.height / 2}} source={{uri: this.props.user.profile_pic}} />;
    }
  }
};

const styles = StyleSheet.create({

  // Wrap for whole user preview
  userWrap: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
    backgroundColor: colors.richBlack,
  },

  // Wrap for the image portion of the preview
  picWrap: {
    flex: 0.25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Wrap for the text portion of the preview
  textWrap: {
    flex: 0.75,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 15,
  },

  // User's picture
  pic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: colors.richBlack,
    borderWidth: 0.5,
  },

  initials: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Full name text
  fullnameText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.richBlack,
  },

  // Username text
  usernameText: {
    fontSize: 12,
    color: colors.richBlack,
  },

});

export default Avatar;
