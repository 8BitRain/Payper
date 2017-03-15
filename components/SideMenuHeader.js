import React from 'react'
import {View, TouchableHighlight, Image, StyleSheet, Dimensions, Text, Platform} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {colors} from '../globalStyles'
import {ProfilePic} from './'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: dims.width * 0.725,
    padding: 14,
    paddingTop: (Platform.OS === 'ios') ? 24 : 10
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: dims.width * 0.725
  },
  profilePicWrap: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 0.65,
    paddingLeft: 12
  },
  iconWrap: {
    flex: 0.15
  }
})

class SideMenuHeader extends React.Component {
  render() {
    return(
      <TouchableHighlight activeOpacity={0.75} underlayColor={'transparent'} onPress={Actions.MyProfile}>
        <View>

          { /* Background gradient */ }
          <Image source={require('../assets/images/accent-to-white.png')} style={styles.backgroundImage} />

          { /* Inner content */ }
          <View style={styles.container}>

            { /* Profile Pic */ }
            <View style={styles.profilePicWrap}>
              <ProfilePic size={42} currentUser={this.props.currentUser} />
            </View>

            { /* Text */ }
            <View style={styles.textWrap}>
              <Text style={{fontSize: 17, color: colors.deepBlue, fontWeight: '500'}}>
                {`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}
              </Text>
              <Text style={{fontSize: 13, color: colors.deepBlue}}>
                {`$${this.props.currentUser.balances.total} in Payper`}
              </Text>
            </View>

            { /* Icons */ }
            <View style={styles.iconWrap}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                { /*
                <EvilIcons name={"user"} size={25} color={colors.deepBlue} />
                <View style={{marginLeft: -8}} />
                */ }
                <EvilIcons name={"chevron-right"} size={22} color={colors.deepBlue} />
              </View>
            </View>

          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = SideMenuHeader
