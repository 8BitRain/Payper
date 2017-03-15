import React from 'react'
import {View, Text, TouchableHighlight, StyleSheet, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {Header, ProfilePic, Wallet} from '../../components'
import {colors} from '../../globalStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Button from 'react-native-button'

const dims = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.snowWhite
  },
  shadow: {
    shadowColor: colors.slateGrey,
    shadowOpacity: 0.7,
    shadowRadius: 1,
    shadowOffset: {height: 0, width: 0}
  }
})

class MyProfileModal extends React.Component {
  render() {
    return (
      <View style={styles.container}>

        { /* Header */ }
        <Header showTitle showBackButton title="My Profile" />

        { /* Name / Username */ }
        <View style={{justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.medGrey, paddingBottom: 15, paddingTop: 15}}>

          { /* Profile pic, name, username */ }
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ProfilePic currentUser={{profilePic: "", initials: "BS"}} size={58} />
            <View style={{width: 10}} />
            <View>
              <Text style={{fontSize: 24, color: colors.deepBlue}}>
                {"Brady Sheridan"}
              </Text>
              <Text style={{fontSize: 16, color: colors.accent}}>
                {"@Brady-Sheridan"}
              </Text>
            </View>
          </View>

          { /* Spacer */ }
          <View style={{height: 15}} />

          { /* Upload profile pic button */ }
          <TouchableHighlight
            activeOpacity={0.75}
            underlayColor={'transparent'}
            onPress={() => this.setState({photoUploaderModalIsVisible: true})}>
            <View style={[styles.shadow, {width: dims.width * 0.72, height: 40, borderRadius: 4, flexDirection: 'row'}]}>
              <View style={{flex: 0.2, backgroundColor: colors.lightGrey, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 4, borderBottomLeftRadius: 4}}>
                <EvilIcons name={"camera"} size={28} color={colors.accent} />
              </View>
              <View style={{flex: 0.75, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 4, borderBottomRightRadius: 4}}>
                <Text style={{fontSize: 16, fontWeight: '400', color: colors.snowWhite}}>
                  {"Upload Profile Picture"}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>

        { /* Wallet */ }
        <Wallet />

      </View>
    )
  }
}

module.exports = MyProfileModal
